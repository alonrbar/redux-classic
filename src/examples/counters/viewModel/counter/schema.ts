import { ComponentSchema } from 'lib';
import { counterComponentActions } from './actions';
import { CounterComponentState } from './state';

export const counterSchema = new ComponentSchema(() => new CounterComponentState(), counterComponentActions);