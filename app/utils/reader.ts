var stdin = process.openStdin();


export async function read() {
    return new Promise((resolve:any, reject: any) => {
        stdin.addListener("data", function(d) {
            resolve(d.toString().trim());
        });
    })
}