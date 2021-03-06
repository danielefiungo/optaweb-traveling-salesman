/*
 * Copyright 2019 Red Hat, Inc. and/or its affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Action } from 'redux';
import { Frame } from 'webstomp-client';

export enum WebSocketConnectionStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  ERROR = 'ERROR',
}

export enum ActionType {
  WS_CONNECT = 'WS_CONNECT',
  WS_CONNECT_SUCCESS = 'WS_CONNECT_SUCCESS',
  WS_CONNECT_FAILURE = 'WS_CONNECT_FAILURE',
}

export interface InitWsConnectionAction extends Action<ActionType.WS_CONNECT> {
}

export interface IWsConnectionSuccessAction extends Action<ActionType.WS_CONNECT_SUCCESS> {
}

export interface IWsConnectionFailureAction extends Action<ActionType.WS_CONNECT_FAILURE> {
  readonly value: Frame | CloseEvent;
}

export type WebSocketAction =
  | InitWsConnectionAction
  | IWsConnectionFailureAction
  | IWsConnectionSuccessAction;
