/**
 * ime任务基类
 */

import { getRootConfig, Root, IMEConfig } from './dependencies/getRootConfig';

import log from '../util/log';

/**
 * beforeTaskRun运行结果
 */
export type beforeTaskRunResult = any;
/**
 * taskRunning运行结果
 */
export type taskRunningResult = any;
/**
 * afterTaskRun运行结果
 */
export type afterTaskRunResult = any;

/**
 * 记录ime运行各阶段的数据
 */
export interface Runtime extends Root {
    /**
     * beforeTaskRun()运行结果
     */
    beforeTaskRun?: beforeTaskRunResult;
    /**
     * taskRunning()运行结果
     */
    taskRunning?: taskRunningResult;
    /**
     * afterTaskRun()运行结果
     */
    afterTaskRun?: afterTaskRunResult;
    /**
     * 任务执行耗时
     */
    duration?: number;
}

export interface IMEBase<P> {
    /**
     * 记录ime运行各阶段的数据
     */
    runtime: Runtime;
    /**
     * ime任务实例化时通过super设置的任务参数
     */
    params?: P;
    /**
     * 任务执行结束返回的结果
     */
    result: any;
    /**
     * 开始执行任务
     */
    run(): Promise<any>;
}

/**
 * 全局debug提醒flag
 */
let debugNoticeFlag: boolean = false;

export abstract class BaseClass<P> implements IMEBase<P> {
    public config: IMEConfig = {};
    public runtime: Runtime = {};
    public result: any;

    constructor(public params?: P) {
        // 初始化项目配置
        this.initConfig();
    }

    /**
     * 开始执行任务
     */
    public async run(): Promise<any> {
        // 记录任务开始时间
        const _startTime: number = new Date().getTime();

        // 初始化相关配置后增加一个钩子，返回false则任务不执行
        if (this.configInited && (await this.configInited()) === false) {
            process.exit(0);
            return;
        }

        // beforeTaskRun...
        this.runtime.beforeTaskRun = this.beforeTaskRun && (await this.beforeTaskRun(this.params));
        if (this.runtime.beforeTaskRun === false) {
            process.exit(0);
            return;
        }

        // taskRunning...
        this.runtime.taskRunning = this.taskRunning && (await this.taskRunning(this.runtime, this.params));

        // 记录任务结束时间
        const _endTime: number = new Date().getTime();
        // 计算任务耗时
        const spendTime = _endTime - _startTime;
        this.runtime.duration = spendTime;

        // afterTaskRun...
        this.runtime.afterTaskRun = this.afterTaskRun && (await this.afterTaskRun(this.params));

        return this.result || this.runtime.taskRunning;
    }
    /**
     * async init()执行后的钩子，可以在这里对ime配置做进一步处理
     */
    protected configInited?(): boolean | void | Promise<boolean | void>;

    /**
     * 开始运行task之前，async()执行如果返回false，则任务中断
     */
    protected beforeTaskRun?(params?: P): Promise<beforeTaskRunResult> | beforeTaskRunResult | boolean | void;

    /**
     * 运行task，这里定义task内容
     */
    protected taskRunning?(runtime: Runtime, params?: P): Promise<taskRunningResult> | taskRunningResult | void;

    /**
     * 运行task结束
     */
    protected afterTaskRun?(params?: P): Promise<afterTaskRunResult> | afterTaskRunResult | void;

    /**
     * 初始化任务, 获取ime配置
     */
    private async initConfig(): Promise<any> {
        // 获取根目录配置
        try {
            const root = getRootConfig()!;

            // 将ime相关路径写进环境变量
            root.rootPath && (process.env.IME_PATH = root.rootPath);
            root.clientPath && (process.env.IME_CLIENT_PATH = root.clientPath);
            root.serverPath && (process.env.IME_SERVER_PATH = root.serverPath);

            // 开启调试模式
            if (root.config && root.config.debug) {
                if (!debugNoticeFlag) {
                    log.error('您已经开启debug模式, ime将会打印更多调试日志');
                }
                debugNoticeFlag = true;
            }
            Object.assign(this.runtime, root);
            Object.assign(this.config, root.config);
        } catch (error) {
            throw new Error(`获取ime配置失败: ${error.message}`);
        }
    }
}
