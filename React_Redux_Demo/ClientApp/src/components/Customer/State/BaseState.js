class BaseState {
    constructor() {
        this.init = this.init.bind(this);
        this.submit = this.submit.bind(this);
        this.close = this.close.bind(this);
        this.getRenderData = this.getRenderData.bind(this);
    }
    init() {
        console.log('init method can not be execute');
    }

    submit() {
        console.log('submit method can not be execute');
    }

    close() {
        console.log('close method can not be execute');
    }

    getRenderData() {
        console.log('getRenderData method can not be execute');
    }
}

export default BaseState