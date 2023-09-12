import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  ParseUUIDPipe,
  Redirect,
  Query,
  Req,
} from '@nestjs/common';
import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import { ExecutionsClient, WorkflowsClient } from '@google-cloud/workflows';
const projectId = 'scenic-treat-398501';
const location = 'us-east1';

@Controller('candidates')
export class CandidatesController {
  constructor(
    private readonly candidatesService: CandidatesService,
    private firebase: FirebaseService,
    private db: FirebaseService,
  ) {
    this.firebase.connect();
    this.firebase.getFirestore();
  }

  @Post()
  create(@Body() createCandidateDto: CreateCandidateDto) {
    return this.candidatesService.create(
      createCandidateDto,
      this.firebase.getFirestore(),
    );
  }

  @Get()
  async findAll() {
    return this.candidatesService.findAll(this.firebase.getFirestore());
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.candidatesService.findOne(+id);
  }

  @Get('uuid/:uuid')
  findOneByUuid(
    @Param(
      'uuid',
      new ParseUUIDPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    uuid: string,
  ) {
    return 'uuid: ' + uuid;
  }

  @Get('docs/:version')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Param('version') version: string) {
    return { url: 'https://docs.nestjs.com/v' + version };
  }

  @Get('/workflows/:id')
  listWorkflows() {
    const client = new WorkflowsClient();
    async function listWorkflows() {
      const [workflows] = await client.listWorkflows({
        parent: client.locationPath(projectId, location),
      });
      for (const workflow of workflows) {
        console.info(`name: ${workflow.name}`);
      }
    }
    listWorkflows();
  }

  @Get('/execute/workflow/:id/:searchTerm')
  executeWorkflow(@Param() params: any) {
    const client = new ExecutionsClient();
    function sleep(ms) {
      return new Promise((resolve) => {
        setTimeout(resolve, ms);
      });
    }
    async function executeWorkflow() {
      try {
        const createExecutionRes = await client.createExecution({
          parent: client.workflowPath(projectId, location, params.id),
          execution: {
            argument: JSON.stringify({
              searchTerm: params.searchTerm,
            }),
          },
        });
        const executionName = createExecutionRes[0].name;
        console.info(`Created execution: ${executionName}`);

        // Wait for execution to finish, then print results.
        let executionFinished = false;
        let backoffDelay = 1000; // Start wait with delay of 1,000 ms
        console.log('Poll every second for result...');
        while (!executionFinished) {
          const [execution] = await client.getExecution({
            name: executionName,
          });
          executionFinished = execution.state !== 'ACTIVE';

          // If we haven't seen the result yet, wait a second.
          if (!executionFinished) {
            console.log('- Waiting for results...');
            await sleep(backoffDelay);
            backoffDelay *= 2; // Double the delay to provide exponential backoff.
          } else {
            console.log(`Execution finished with state: ${execution.state}`);
            console.log(execution.result);
            return execution.result;
          }
        }
      } catch (error) {
        console.log('something failed executing workflow: ' + error);
      }
    }
    executeWorkflow();
  }

  @Patch(':id')
  update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateCandidateDto: UpdateCandidateDto,
  ) {
    return this.candidatesService.update(+id, updateCandidateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.candidatesService.remove(+id);
  }
}
