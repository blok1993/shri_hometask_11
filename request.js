/**
 * Библиотека имеет публичный метод get с 3-мя аргументами: url, onResolve, onReject.
 * Гарантируется последовательное выполнение запросов (.get(...).get(...)), благодаря использованию промисов.
 */
class Request {
    /**
     * Инициализируем первичный promise.
     */
    constructor() {
        this.promise = Promise.resolve();
    }

    /**
     * Заглушка для ajax запроса.
     * В es6 имеется также достойная альтернатива XMLHttpRequest - это fetch.
     * При работе с реальными данными, можно им воспользоваться.
     */
    _ajaxRequestStub(item) {
        return new Promise((resolve, reject) => {
            // Эмулируем время ответа сервера от 30 до 250 ms.
            const timeout = Math.floor((Math.random() * 250) + 30);

            setTimeout(() => {
                console.log(`Requested url: ${item}, Pending time: ${timeout}ms`);

                // Для примера вызываем resolve.
                resolve(timeout);
            }, timeout);
        });
    }

    get(url, onResolve, onReject) {
        this.promise = this.promise.then((prevRequestResult) => {
                // Передаем в onResolve данные, полученные из предыдущего запроса.
                onResolve(prevRequestResult);
                return this._ajaxRequestStub(url);
            }, (error) => {
                onReject(error)
            })
            .catch(() => {
                console.log("При обращении к серверу произошла ошибка.");
            });

        return this;
    }
};

const exampleRequest = new Request();

/**
 * Строка ниже закомментирована для демонстрации примера работы библиотеки.
 * Но ее необходимо будет раскомментировать, в момент подключения exampleRequest в другом файле проекта.
 */

//export default exampleRequest;


/*
 * Методы onResolveMethod и onRejectMethod для примера.
 */
const onResolveMethod = (data) => {
    console.log(data ? data : null);
};

const onRejectMethod = (data) => {
    console.error(data ? data : null);
};

/**
 * Пример использования библиотеки.
 */
exampleRequest
    .get('https://example1.com/one.json', onResolveMethod, onRejectMethod)
    .get('https://example2.com/two.json', onResolveMethod, onRejectMethod)
    .get('https://example3.com/three.json', onResolveMethod, onRejectMethod);

