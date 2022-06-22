import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import {
  deleteItem, deleteAll, MarkerOption, setInsertAfter, setAppend, setTime, loadMarkers,
} from './Reducer/markersSlice';
import { RootState } from './store';

interface MarkerItemProps {
  index: number;
  option: MarkerOption;
}

const MarkerItem: React.FC<MarkerItemProps> = ({ option, index }) => {
  const dispatch = useDispatch();
  const dispatchSetInsertAfter = () => dispatch(setInsertAfter(index));
  const dispatchDeleteItem = () => dispatch(deleteItem(index));
  const dispatchSetTime = (time: number) => dispatch(setTime({ index, time }));
  return (
    <div>
      <div>
        {`${index}, Time: `}
        <input type="number" value={option.time} onChange={e => dispatchSetTime(Number.parseFloat(e.target.value) || 0)} />
      </div>
      <button onClick={dispatchDeleteItem}>Delete</button>
      <button onClick={dispatchSetInsertAfter}>Insert After</button>
    </div>
  );
};

const Timeline = () => {
  const markers = useSelector((rootState: RootState) => rootState.markers);
  const dispatch = useDispatch();
  const dispatchDeleteAll = () => dispatch(deleteAll());
  const dispatchAppend = () => dispatch(setAppend());
  const dispatchLoadMarker = (m: typeof markers.markers) => dispatch(loadMarkers(m));
  const saveMarkersIntoLocal = () => {
    localStorage.setItem('markers', JSON.stringify(markers.markers));
  };
  const loadMarkersFromLocal = () => {
    const m = localStorage.getItem('markers');
    if (m) {
      dispatchLoadMarker(JSON.parse(m));
    }
  };

  return (
    <div>
      {markers.markers.map((marker, i) => (
        <MarkerItem
          key={marker.createTime}
          index={i}
          option={marker}
          // deleteItem={() => dispatch(deleteItem(i))}
        />
      ))}
      <div>
        <button onClick={dispatchAppend}>Append</button>
        <button onClick={dispatchDeleteAll}>Delete all</button>
        <button onClick={saveMarkersIntoLocal}>Save</button>
        <button onClick={loadMarkersFromLocal}>Load</button>
      </div>
    </div>
  );
};

export default Timeline;
