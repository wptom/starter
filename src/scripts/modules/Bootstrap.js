class Bootstrap {
    constructor() {
        // this.el = {
        //     input: 'custom-class',
        // };

        this.runBootstrap();
    }

    runBootstrap() {
        $(function () {
            $('[data-toggle="popover"]').popover()
        });
    }
}
export default Bootstrap;