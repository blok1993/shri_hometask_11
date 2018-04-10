/**
 * Библиотека Request предназачена для совершения последовательных запросов.
 * Имеется метод get, который можно чейнить.
 * Каждый последующий запрос имеет доступ к данным, полученным из предыдущего запроса.
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
            const pendingTime = Math.floor((Math.random() * 250) + 30);

            setTimeout(() => {
                // Используем шаблонные строки для вывода логов.
                console.log(`Requested url: ${item}, Pending time: ${pendingTime}ms`);

                // Для примера вызываем resolve, и передаем туда время выполнения текущего запроса.
                resolve(pendingTime);
            }, pendingTime);
        });
    }

    /**
     * Метод get принимает 3 аргумента: url, onResolve, onReject.
     * Гарантируется последовательное выполнение запросов (.get(...).get(...)), благодаря использованию промисов.
     */
    get(url, onResolve, onReject) {
        this.promise = this.promise.then((prevRequestResult) => {
            // Передаем в onResolve данные, полученные из предыдущего запроса.
            onResolve(prevRequestResult);

            return this._ajaxRequestStub(url);
        })
            .catch((error) => {
                onReject(error);
            });

        return this;
    }
}

// Создаем экземпляр класса Request.
const exampleRequest = new Request();

// Строку ниже необходимо будет раскомментировать в момент подключения exampleRequest в другом файле проекта.
// export default exampleRequest;

/*
 * Методы onResolveMethod и onRejectMethod для примера.
 */
const onResolveMethod = (data) => {
    console.log(data ? `Previous request data: ${data}` : null);
};

const onRejectMethod = (data) => {
    console.log(data ? data : 'При обращении к серверу произошла ошибка.');
};

/**
 * Пример использования библиотеки.
 */
exampleRequest
    .get('https://example1.com/one.json', onResolveMethod, onRejectMethod)
    .get('https://example2.com/two.json', onResolveMethod, onRejectMethod)
    .get('https://example3.com/three.json', onResolveMethod, onRejectMethod);