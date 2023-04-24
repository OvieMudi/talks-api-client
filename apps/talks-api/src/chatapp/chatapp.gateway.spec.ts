import { Test, TestingModule } from '@nestjs/testing';
import { ChatappGateway } from './chatapp.gateway';

describe('ChatappGateway', () => {
  let gateway: ChatappGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatappGateway],
    }).compile();

    gateway = module.get<ChatappGateway>(ChatappGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
