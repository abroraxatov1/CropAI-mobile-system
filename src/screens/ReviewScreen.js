import React from 'react';
import SoilEntryForm from './SoilEntryForm';

export default function ReviewScreen({ navigation, route }) {
  const { sensorValues, sourceLabel } = route.params || {};
  return (
    <SoilEntryForm
      navigation={navigation}
      initialSensorValues={sensorValues}
      source="upload"
      sourceLabel={sourceLabel}
    />
  );
}
