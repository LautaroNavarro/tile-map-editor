
class Engine {

  accumulated_time = 0;
  animation_frame_request = undefined;
  time = undefined;
  time_step = undefined;
  updated = false;
  update = undefined;
  render = undefined;

  constructor (time_step, update, render) {
    this.time_step = time_step;
    this.update = update;
    this.render = render;
  }

  run (time_stamp) {

    this.accumulated_time += time_stamp - this.time;
    this.time = time_stamp;
    while(this.accumulated_time >= this.time_step) {
      this.accumulated_time -= this.time_step;
      this.update(time_stamp);
      this.updated = true;
    }

    if (this.updated) {
      this.updated = false;
      this.render(time_stamp);
    }
    this.animation_frame_request = window.requestAnimationFrame((time_step) => {
      this.handleRun(time_step);
    });

  }

  handleRun (time_step) {
    this.run(time_step);
  };

  getaccumulated_time () {
    return this.accumulated_time;
  }

  start () {

    this.accumulated_time = this.time_step;
    this.time = window.performance.now();
    this.animation_frame_request = window.requestAnimationFrame((time_step) => {
      this.handleRun(time_step);
    });

  }

  stop () {
    window.cancelAnimationFrame(this.animation_frame_request);
  }

}
