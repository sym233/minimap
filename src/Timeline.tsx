import React, { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { timeline, Timeline as TimelineType, TimelineItem } from './store';

interface InputProps {
  label: string;
  defaultValue: number;
  onChange?: (value: number) => void;
}

const Input: FC<InputProps> = ({ label, defaultValue, onChange }) => {
  const [s, setS] = useState(defaultValue.toString());

  useEffect(() => {
    setS(defaultValue.toString());
  }, [defaultValue]);

  useEffect(() => {
    if (s === defaultValue.toString()) {
      return;
    }
    if (s) {
      const n = Number.parseFloat(s);
      if (!Number.isNaN(n)) {
        onChange?.(n);
      }
    }
  }, [s]);

  const onBlur = () => {
    setS(defaultValue.toString());
  };

  const name = `Input-${label}`;
  return (
    <label htmlFor={name} style={{ margin: '0 0.2em' }}>
      {label}
      :
      <input
        name={name}
        type="number"
        value={s}
        onBlur={onBlur}
        onChange={e => {
          setS(e.target.value);
        }}
      />
    </label>
  );
};

interface MarkerItemProps {
  index: number;
  item: TimelineItem;
  insertOption: TimelineType['insertOption'];
}

const MarkerItem: React.FC<MarkerItemProps> = observer(({ item, index, insertOption }) => {
  const {
    arrivalTime,
    waitUntil,
    // zoom,
  } = item;

  return (
    <div>
      <div>
        {index}
        -
        <Input label="Arrival Time(s)" defaultValue={arrivalTime} onChange={v => timeline.setArrivalTime(index, v)} />
        {
          waitUntil === undefined
            ? <button type="button" onClick={() => timeline.setWaitUntil(index, arrivalTime)}>toggle wait</button>
            : (
              <>
                <Input label="Wait Until(s)" defaultValue={waitUntil} onChange={v => timeline.setWaitUntil(index, v)} />
                <button type="button" onClick={() => timeline.setWaitUntil(index)}>toggle not wait</button>
              </>
            )
        }

        {/* <Input
          label="Zoom"
          defaultValue={zoom}
          onChange={v => timeline.setZoom(index, v)}
        /> */}
      </div>
      <button type="button" onClick={() => timeline.deleteItem(index)}>Delete</button>
      <button
        type="button"
        onClick={() => timeline.setInsertBefore(index)}
        style={typeof insertOption === 'object' && insertOption.insertBefore === index
          ? { border: '2px solid black' } : {}}
      >
        Insert Before
      </button>
    </div>
  );
});

interface TimelineProps {
  tl: TimelineType
}

const Timeline: FC<TimelineProps> = observer(({ tl }) => {
  const { timelineItems, insertOption, showMarkers } = tl;
  return (
    <div>
      <div className="timeline_markers">
        {timelineItems.map((item, i) => (
          <MarkerItem
            key={item.createTime}
            index={i}
            item={item}
            insertOption={insertOption}
          />
        ))}
      </div>
      <div>
        <button
          onClick={() => timeline.setAppend()}
          type="button"
          style={insertOption === 'append'
            ? { border: '2px solid black' } : {}}
        >
          Append
        </button>
        <button type="button" onClick={() => tl.deleteAll()}>Delete all</button>
        <button type="button" onClick={() => tl.saveTimeline()}>Save</button>
        <button type="button" onClick={() => tl.loadTimeline()}>Load</button>
        <button
          type="button"
          onClick={() => tl.setShow(!showMarkers)}
        >
          {showMarkers ? 'Hide Markers' : 'Show Markers'}
        </button>
      </div>
    </div>
  );
});

export default Timeline;
