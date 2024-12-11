import { SneakForward } from './actions/plugins/sneak';
import { MoveFindForward, MoveFindBackward } from './actions/motion';
import { ExtensionContext, EventEmitter, Position } from 'vscode';
import { Mode } from './mode/mode';
import { getAndUpdateModeHandler } from '../extensionBase';

// 定义事件类型接口
export interface ISneakStartEvent {
  keysPressed: string[];
}

export interface ISneakEndEvent {
  line: number;
  searchString: string;
}

export interface IFindStartEvent {
  keysPressed: string[];
}

export interface IFindEndEvent {
  position: Position;
  searchChar: string;
}

export class VimAPI implements Disposable {
  private readonly sneakForwardStartEmitter = new EventEmitter<ISneakStartEvent>();
  private readonly sneakForwardEndEmitter = new EventEmitter<ISneakEndEvent>();
  private readonly findForwardStartEmitter = new EventEmitter<IFindStartEvent>();
  private readonly findForwardEndEmitter = new EventEmitter<IFindEndEvent>();
  private readonly findBackwardStartEmitter = new EventEmitter<IFindStartEvent>();
  private readonly findBackwardEndEmitter = new EventEmitter<IFindEndEvent>();
  private readonly modeChangeEmitter = new EventEmitter<Mode>();

  // 公开事件
  public readonly onSneakForwardStart = this.sneakForwardStartEmitter.event;
  public readonly onSneakForwardEnd = this.sneakForwardEndEmitter.event;
  public readonly onFindForwardStart = this.findForwardStartEmitter.event;
  public readonly onFindForwardEnd = this.findForwardEndEmitter.event;
  public readonly onFindBackwardStart = this.findBackwardStartEmitter.event;
  public readonly onFindBackwardEnd = this.findBackwardEndEmitter.event;
  public readonly onModeChanged = this.modeChangeEmitter.event;

  constructor() {
    // 订阅 Sneak 类中的事件
    SneakForward.onSneakForwardStart.event((e) => this.sneakForwardStartEmitter.fire(e));
    SneakForward.onSneakForwardEnd.event((e) => this.sneakForwardEndEmitter.fire(e));
    MoveFindForward.onFindForwardStart.event((e) => this.findForwardStartEmitter.fire(e));
    MoveFindForward.onFindForwardEnd.event((e) => this.findForwardEndEmitter.fire(e));
    MoveFindBackward.onFindBackwardStart.event((e) => this.findBackwardStartEmitter.fire(e));
    MoveFindBackward.onFindBackwardEnd.event((e) => this.findBackwardEndEmitter.fire(e));

    // 使用void操作符来明确标记这是一个未处理的Promise
    void this.listenToModeChanges();
  }
  [Symbol.dispose](): void {
    throw new Error('Method not implemented.');
  }

  public async getCurrentMode(): Promise<Mode | undefined> {
    const modeHandler = await getAndUpdateModeHandler();
    return modeHandler?.vimState.currentMode;
  }

  private async listenToModeChanges() {
    const modeHandler = await getAndUpdateModeHandler();
    if (modeHandler) {
      // 当 vimState 的模式发生变化时触发事件
      modeHandler.vimState.onModeChanged((newMode: Mode) => {
        this.modeChangeEmitter.fire(newMode);
      });
    }
  }

  dispose() {
    this.sneakForwardStartEmitter.dispose();
    this.sneakForwardEndEmitter.dispose();
    this.findForwardStartEmitter.dispose();
    this.findForwardEndEmitter.dispose();
    this.findBackwardStartEmitter.dispose();
    this.findBackwardEndEmitter.dispose();
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
