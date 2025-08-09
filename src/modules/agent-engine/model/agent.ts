import { Annotation } from "@langchain/langgraph";
import { Bot, Instance, Chat, Message, User } from "./tables";
import { Template } from "./templates";
import { Entry } from "./entry";

export const context_definition = Annotation.Root({
  payload: Annotation<NodePayload>({
    reducer: (_prev, next) => next,
    default: () => ({
      entry:        undefined as unknown as Entry,
      bot:          undefined as unknown as Bot,
      user:         undefined as unknown as User,
      instance:     undefined as unknown as Instance,
      chat:         undefined as unknown as Chat,
      messages:     undefined as unknown as Message[],
    }),
  }),
  result: Annotation<NodeResponse>({
    reducer: (_prev, next) => next,
    default: () => ({ 
      status: undefined as unknown as boolean, 
      templates: undefined as unknown as Template[],
    }),
  }),
});

export type Context = typeof context_definition.State;

export class NodeResponse {
  status: boolean = true;
  templates: Template[] = [];
}

export class NodePayload {
  entry: Entry;
  bot?: Bot;
  user?: User;
  instance?: Instance;
  chat?: Chat;
  messages?: Message[];
}