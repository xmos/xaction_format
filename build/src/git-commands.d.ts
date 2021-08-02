export declare function checkoutBranch(branch: string): Promise<void>;
export declare function haveFilesChanged(): Promise<Boolean>;
export declare function commit(commitMessage: string): Promise<number>;
export declare function push(): Promise<void>;
