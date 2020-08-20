export enum ECheckAndGetReturnTypes {
    string = 'string',
    number = 'number'
}

export type TCheckAndGetTypes = keyof typeof ECheckAndGetReturnTypes;
