import React from 'react';
import SoilEntryForm from './SoilEntryForm';

export default function ManualEntryScreen({ navigation }) {
  return <SoilEntryForm navigation={navigation} initialSensorValues={null} source="manual" sourceLabel={null} />;
}
