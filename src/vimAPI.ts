import { SneakForward } from './actions/plugins/sneak';
import { ExtensionContext, EventEmitter } from 'vscode';

// 定义事件类型接口
export interface ISneakStartEvent {
  keysPressed: string[];
}

export interface ISneakEndEvent {
  line: number;
  searchString: string;
}

export class VimAPI implements Disposable {
  private readonly sneakForwardStartEmitter = new EventEmitter<ISneakStartEvent>();
  private readonly sneakForwardEndEmitter = new EventEmitter<ISneakEndEvent>();

  // 公开事件
  public readonly onSneakForwardStart = this.sneakForwardStartEmitter.event;
  public readonly onSneakForwardEnd = this.sneakForwardEndEmitter.event;

  constructor() {
    // 订阅 Sneak 类中的事件
    SneakForward.onSneakForwardStart.event((e) => this.sneakForwardStartEmitter.fire(e));
    SneakForward.onSneakForwardEnd.event((e) => this.sneakForwardEndEmitter.fire(e));
  }
  [Symbol.dispose](): void {
    throw new Error('Method not implemented.');
  }

  dispose() {
    this.sneakForwardStartEmitter.dispose();
    this.sneakForwardEndEmitter.dispose();
  }
}

let vimAPInstance: VimAPI | undefined;

export function getVimAPI(): VimAPI {
  if (!vimAPInstance) {
    vimAPInstance = new VimAPI();
  }
  return vimAPInstance;
}

export function activate(context: ExtensionContext) {
  const api = new VimAPI();
  context.subscriptions.push(api); // 现在可以正确添加到 subscriptions
  return api;
}
