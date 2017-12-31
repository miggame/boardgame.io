/*
 * Copyright 2017 The boardgame.io Authors
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import Game from './game';
import { createStore } from 'redux';
import { createGameReducer } from './reducer';
import { Flow, createEventDispatchers, GameFlow } from './flow';

test('Flow', () => {
  const flow = Flow({});
  const state = {};
  expect(flow.reducer(state, { type: 'unknown' })).toBe(state);
});

test('default flow', () => {
  const flow = GameFlow({});

  expect(flow.eventNames).toEqual(['endTurn']);
  let state = { ctx: flow.setup(2) };
  expect(state.ctx.turn).toBe(0);
  state = flow.reducer(state, { type: 'endTurn' });
  expect(state.ctx.turn).toBe(1);
});

test('flow with phases', () => {
  const flow = GameFlow({
    phases: {
      'A': {},
      'B': {},
    },
  });

  expect(flow.eventNames).toEqual(['endTurn', 'endPhase']);
  let state = { ctx: flow.setup(2) };
  expect(state.ctx.turn).toBe(0);
  state = flow.reducer(state, { type: 'endTurn' });
  expect(state.ctx.turn).toBe(1);

  expect(state.ctx.phase).toBe('A');
  state = flow.reducer(state, { type: 'endPhase' });
  expect(state.ctx.phase).toBe('B');
  state = flow.reducer(state, { type: 'endPhase' });
  expect(state.ctx.phase).toBe('A');
});

test('dispatchers', () => {
  const game = Game({});
  const reducer = createGameReducer({game, numPlayers: 2});
  const store = createStore(reducer);
  const api = createEventDispatchers(game.flow.eventNames, store);
  expect(Object.getOwnPropertyNames(api)).toEqual(['endTurn']);

  expect(store.getState().ctx.turn).toBe(0);
  api.endTurn();
  expect(store.getState().ctx.turn).toBe(1);
});