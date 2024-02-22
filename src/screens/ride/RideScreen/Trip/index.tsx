import React from 'react';
import { BottomWindowWithGesture } from 'shuttlex-integration';

import HiddenPart from './HiddenPart';
import VisiblePart from './VisiblePart';

const Trip = () => <BottomWindowWithGesture visiblePart={<VisiblePart />} hiddenPart={<HiddenPart />} />;

export default Trip;
