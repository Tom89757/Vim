// vimAPI.ts
import { SneakForward } from './actions/plugins/sneak';
import { ExtensionContext, EventEmitter } from 'vscode';

export function activate(context: ExtensionContext) {
  return {
    onSneakForwardStart: SneakForward.onSneakForwardStart,
    onSneakForwardEnd: SneakForward.onSneakForwardEnd,
    dispose: () => {
      SneakForward.onSneakForwardStart.dispose();
      SneakForward.onSneakForwardEnd.dispose();
    },
  };
}
