export enum PositionEnum {
  A = 0,
  B = 1,
}
export const BasePositions = [PositionEnum.A, PositionEnum.B] as const;
export type BasePosition = undefined | (typeof BasePositions)[number];
export type Position = undefined | BasePosition;

export function getOtherPosition(
  pos: PositionEnum | undefined
): PositionEnum | undefined {
  if (pos === PositionEnum.A) return PositionEnum.B;
  if (pos === PositionEnum.B) return PositionEnum.A;
  return undefined;
}

export enum CharacterStateEnum {
  Dead = "dead",
  Survivor = "survivor",
}

export type CharacterState = CharacterStateEnum | undefined;

export type AIChoiceResult = {
  survivor: string;
  survivor_position?: PositionEnum;
  reasons: string[];
  revised_credo: string;
  model: string;
};
