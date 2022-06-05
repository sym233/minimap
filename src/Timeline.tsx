import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { deleteItem, deleteAll, MarkerOption } from './Reducer/markersSlice';
import { RootState } from './store';

interface MarkerItemProps {
  index: number;
  option: MarkerOption;
  deleteItem?: () => void;
}

const MarkerItem: React.FC<MarkerItemProps> = ({ option, deleteItem, index }) => {
  // const { lat, lng } = option.position;
  return (
    <div>
      <div>{index}</div>
      {deleteItem ? <button onClick={deleteItem}>Delete</button> : null}
    </div>
  );
};

const Timeline = () => {
  const markers = useSelector((rootState: RootState) => rootState.markers);
  const dispatch = useDispatch();
  return (
    <div>
      {markers.map((marker, i) => (
        <MarkerItem
          key={marker.createTime}
          index={i}
          option={marker}
          deleteItem={() => dispatch(deleteItem(i))}
        />
      ))}
      <div><button onClick={() => dispatch(deleteAll())}>Delete all</button></div>
    </div>
  );
};

export default Timeline;
