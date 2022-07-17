# Mimimap

[Github Pages](https://sym233.github.io/minimap/)
A web app that shows moving trace on map as video.
This app uses Google Map Api.

Example: A POV tram video with minimap displayed at bottom right. Watch it at [Bilibili](https://www.bilibili.com/video/BV1KB4y1W7qo/) or [Youtube](https://youtu.be/Vy0xbCJpsKg).

## Usage
- Visit [Github Pages](https://sym233.github.io/minimap/) and you see should see the map shown.
- Drag the map to move and zoom it as you wish. You can click `Get My Location` button on the right to move the map to your location (location permission is needed).
- Click on the map to get a serial of markers as path. You can add markers by appending them to the end or inserting them before a marker. And you can also delete them. See buttons on the right.
- Add time (in second) for each marker, indicating the time when the map centers on that marker. Note that time must be strictly increasing. Consider them as key frames in the video.
- You can save the path data on your browser by `Save` button, in order not to lose you work. And `Load` button for retrieve it.
- Click `Run` button on the right to see moving map animation. And `Stop` button to stop running.
- Click `Record` button to record the map movement. You should grant permission and choose this web page for it. And `Stop Recording` button to end the screen recording. Then a link will occur for video download. You can start another video recording, but the previous video will be overwritten.

## Setup
If you want to read source code or modify it.
- Clone the repo.
- Run `yarn install`, or use other package manager as you wish.
- Run `yarn start` to run it on your local machine.
- The App uses a restricted Google api key. If you want to redistribute it, you should apply your own key for it.
