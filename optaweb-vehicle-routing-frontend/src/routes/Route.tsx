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

import {
  FormSelect,
  FormSelectOption,
  Split,
  SplitItem,
  Text,
  TextContent,
  TextVariants,
} from '@patternfly/react-core';
import * as React from 'react';
import LocationList from 'src/components/LocationList';
import TspMap from 'src/components/TspMap';

import { IDispatchProps, IStateProps } from 'src/containers/OVR';
import { ILatLng } from 'src/store/route/types';

export interface IRouteState {
  center: ILatLng;
  maxDistance: number;
  selectedId: number;
  zoom: number;
}
type IRouteProps = IDispatchProps & IStateProps;
export default class Route extends React.Component<IRouteProps, IRouteState> {
  constructor(props: IRouteProps) {
    super(props);

    this.state = {
      center: {
        lat: 50.85,
        lng: 4.35,
      },
      maxDistance: -1,
      selectedId: NaN,
      zoom: 9,
    };
    this.onSelectLocation = this.onSelectLocation.bind(this);
    this.handleMapClick = this.handleMapClick.bind(this);
  }
  handleMapClick(e: any) {
    this.props.addHandler(e.latlng);
  }

  onSelectLocation(id: number) {
    this.setState({ selectedId: id });
  }
  componentWillUpdate() {
    if (this.props.route) {
      const intDistance = parseInt(this.props.route.distance || '0', 10);
      const { maxDistance: currentMax } = this.state;

      if ((currentMax === -1 && intDistance > 0) || currentMax < intDistance) {
        this.setState({ maxDistance: intDistance });
      }
    }
  }
  render() {
    const { center, zoom, selectedId, maxDistance } = this.state;
    const {
      route,
      domicileId,
      removeHandler,
      loadHandler,
      clearHandler,
      isDemoLoading,
    } = this.props;
    return (
      <React.Fragment>
        <TextContent>
          <Text component={TextVariants.h1}>Route</Text>
        </TextContent>
        <Split gutter="md">
          <SplitItem isMain={false}>
            <FormSelect
              value={''}
              onChange={e => console.log(e)}
              aria-label="FormSelect Input"
            >
              {[{ disabled: false, value: 'wip', label: 'Vehicle 4' }].map(
                (option, index) => (
                  <FormSelectOption
                    isDisabled={option.disabled}
                    key={index}
                    value={option.value}
                    label={option.label}
                  />
                ),
              )}
            </FormSelect>
            <LocationList
              route={route}
              domicileId={domicileId}
              maxDistance={maxDistance}
              removeHandler={removeHandler}
              selectHandler={this.onSelectLocation}
              loadHandler={loadHandler}
              clearHandler={clearHandler}
              isDemoLoading={isDemoLoading}
            />
          </SplitItem>
          <SplitItem isMain={true}>
            <TspMap
              center={center}
              zoom={zoom}
              selectedId={selectedId}
              clickHandler={this.handleMapClick}
              removeHandler={removeHandler}
              route={route}
              domicileId={domicileId}
            />
          </SplitItem>
        </Split>
      </React.Fragment>
    );
  }
}
