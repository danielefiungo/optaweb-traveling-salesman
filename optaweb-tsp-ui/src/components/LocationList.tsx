/*
 * Copyright 2018 Red Hat, Inc. and/or its affiliates.
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

import { Button, Card, CardBody, CardHeader } from '@patternfly/react-core';
import * as React from 'react';
import { ITSPRoute } from '../store/tsp/types';
import Location from './Location';
import TripData from './TripData';

export interface ILocationListProps {
  removeHandler: (id: number) => void;
  selectHandler: (id: number) => void;
  loadHandler: () => void;
  clearHandler: () => void;
  maxDistance: number;
  route: ITSPRoute;
}

const renderEmptyLocationList = ({ loadHandler }: ILocationListProps) => {
  return (
    <Card>
      <CardHeader>Click map to add locations</CardHeader>
      <CardBody>
        <Button type="button" style={{ width: '100%' }} onClick={loadHandler}>
          Load demo
        </Button>
      </CardBody>
    </Card>
  );
};

const renderLocationList = ({
  route: { distance, route, domicileId },
  removeHandler,
  selectHandler,
  clearHandler,
  maxDistance,
}: ILocationListProps) => {
  return (
    <Card>
      <CardHeader>
        Distance: {distance}
        <br />
        Locations: {route.length}
        <TripData
          maxDistance={maxDistance}
          distance={parseInt(distance, 10) || maxDistance}
        />
        <br />
        <Button type="button" style={{ width: '100%' }} onClick={clearHandler}>
          Clear
        </Button>
        <br />
      </CardHeader>
      <CardBody>
        {/*
        The calculated maxHeight is a hack because the last constant depends
        on the height of CardHeader (above).
        */}
        <div style={{ maxHeight: 'calc(100vh - 24px - 24px - 8px - 196px)', overflowY: 'auto' }}>
          {route
            .slice(0) // clone the array because
            // sort is done in place (that would affect the route)
            .sort((a, b) => a.id - b.id)
            .map(location => (
              <Location
                key={location.id}
                id={location.id}
                removeDisabled={route.length > 1 && location.id === domicileId}
                removeHandler={removeHandler}
                selectHandler={selectHandler}
              />
            ))}
        </div>
      </CardBody>
    </Card>
  );
};

const LocationList: React.SFC<ILocationListProps> = (
  props: ILocationListProps,
) => {
  return (
    <div
      className="leaflet-top leaflet-left leaflet-touch"
      style={{ zIndex: 500 }}
    >
      <div className="leaflet-control leaflet-bar">
        {props.route.route.length === 0
          ? renderEmptyLocationList(props)
          : renderLocationList(props)}
      </div>
    </div>
  );
};

export default LocationList;
