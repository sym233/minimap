import React from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { deleteItem, deleteAll, MarkerOption } from './Reducer/markersSlice';
import { RootState } from './store';

interface MarkerItemProps {
  option: MarkerOption;
  deleteItem?: () => void;
}

const MarkerItem: React.FC<MarkerItemProps> = ({ option, deleteItem }) => {
  const { lat, lng } = option.position!;
  return (
    <div>
      <div>{`lat: ${lat}, lng: ${lng}`}</div>
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
          option={marker}
          deleteItem={() => dispatch(deleteItem(i))}
        />
      ))}
      <div><button onClick={() => dispatch(deleteAll())}>Delete all</button></div>
    </div>
  );
};

export default Timeline;
