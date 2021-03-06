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

import * as SockJS from 'sockjs-client';
import webstomp, { Client, Frame } from 'webstomp-client';
import { ILatLng, ITSPRouteWithSegments } from '../store/tsp/types';

export default class TspClient {

  readonly socketUrl: string;
  webSocket: WebSocket;
  stompClient: Client;

  constructor(socketUrl: string) {
    this.socketUrl = socketUrl;
  }

  connect(successCallback: () => any, errorCallback: (err: CloseEvent | Frame) => any) {
    this.webSocket = new SockJS(this.socketUrl);
    this.stompClient = webstomp.over(this.webSocket, { debug: true });
    this.stompClient.connect(
      {}, // no headers
      () => {
        successCallback();
      },
      (err) => {
        errorCallback(err);
      },
    );
  }

  addLocation(latLng: ILatLng) {
    this.stompClient.send('/app/place', JSON.stringify(latLng));
  }

  loadDemo() {
    this.stompClient.send('/app/demo');
  }

  deleteLocation(locationId: number) {
    this.stompClient.send(`/app/place/${locationId}/delete`, JSON.stringify(locationId));
  }

  clear() {
    this.stompClient.send('/app/clear');
  }

  subscribe(subscriptionCallback: (route: ITSPRouteWithSegments) => any): void {
    this.stompClient.subscribe('/topic/route', (message) => {
      const tsp = JSON.parse(message.body);
      subscriptionCallback(tsp);
    });
  }
}
