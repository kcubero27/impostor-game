import { PlayerName } from "./player-name.value-object";

export class Player {
  private readonly id: string;
  private _name: PlayerName | null;

  private constructor(id: string, name: PlayerName | null) {
    this.id = id;
    this._name = name;
    if (!id || id.trim().length === 0) {
      throw new Error("Player ID cannot be empty");
    }
  }

  static create(id: string, name: string = ""): Player {
    const playerName = name.trim().length > 0 ? PlayerName.create(name) : null;
    return new Player(id, playerName);
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this._name?.getValue() ?? "";
  }

  hasValidName(): boolean {
    return this._name !== null && this._name.isValid();
  }
}
