import type { LoaderCtx, PipeCtx } from "starfx";
import { ActionWithPayload } from "starfx";
import type { Result } from "starfx";

export interface ThunkCtx<P = any, D = any> extends PipeCtx<P>, LoaderCtx<P> {
  actions: ActionWithPayload<P>[];
  json: D | null;
  result: Result<any>;
}

export type { Next } from "starfx";


declare global {
	interface Window {
	  fx: any
	}
  }