import { TResult } from '../../Game.interface';

export interface IEndGameProps {
  isOpen?: boolean;
  results: TResult[];
  handleRepeat: () => void;
}
