declare global {
    var env: Environment;
}
export interface PackageManifest {
    /**
     * Unique id for the package
     */
    id: string;
    /**
     * Name of the package
     */
    name: string;
    /**
     * Version number
     */
    version: number;
    /**
     * Type of the package
     */
    type: "kosmos" | "express";
    /**
     * Url to package content.
     */
    url: string;
}
export interface Environment {
    /**
     * Store persistent data, such as cookies
     */
    storage: Storage;
    /**
     * Http client factory to create axios instances.
     * All http requests must use an axios instance. Everything else such as fetch, XmlHttpRequest will fail.
     */
    http: HttpClientFactory;
    /**
     * Contains information about the app
     */
    app: App;
}
export interface HttpClientFactory {
    /**
     * Create an axios instance to make http requests.
     * Documentation for axios can be found here
     * https://github.com/axios/axios
     */
    create(): HttpClientInstance;
}
export interface App {
    /**
    * A jwt token [algorithm: RS256] created by the app for your package which can be used as an authentication tool.
    *
    * You can verify the authenticity of this token by verifying the signature of this token with the apps public key for source provider packages.
    * This can be found on the official developer documentation site.
     */
    jwtToken: string;
}
/**
 *
 */
export interface Package {
    /**
     * Returns a promise for a array of ProviderMetadata. Called only once at installation time.
     */
    createProviderMetadata(): Promise<ProviderMetadata[]>;
    /**
     * Create a provider for the metadata provided.
     * @param metadata
     */
    createProvider(metadata: ProviderMetadata): Promise<Provider>;
}
export interface Provider {
    /**
     * Search sources for a movie
     * @param movie Movie to search
     */
    searchMovie(movie: Movie): Promise<Source[]>;
    /**
     * Search sources for an episode
     * @param episode Episode to search
     */
    searchEpisode(episode: Episode): Promise<Source[]>;
    /**
     * Search sources for a season
     * @param season Season to search
     */
    searchSeason(season: Season): Promise<Source[]>;
}
/**
 * Type of source
 */
export declare const enum SourceTypes {
    /**
     * Sources that does not require a a hoster premium subscription to be unlocked.
     */
    FREE_HOSTER = "1",
    /**
     * Sources that requires a hoster premium subscription to be unlocked.
     */
    PREMIUM_HOSTER = "2",
    /**
     * Sources that may or may not require a hoster premium subscription to be unlocked.
     */
    HOSTER = "3",
    /**
     * Sources that are a magnet uri.
     */
    TORRENT = "4",
    /**
     * Sources that does not need unlocking and can be viewed directly.
     */
    DIRECT = "5"
}
export declare type ProviderMetadata = {
    /**
     * Name of the provider
     */
    name: string;
    /**
     * Types of sources this provider may return.
     * Failing to declair correct types will result in slow
     * source resolving.
     */
    sourceTypes: SourceTypes[];
    /**
     * ISO 639-1 lang codes for this provider
     */
    languages?: string[];
    /**
     * Supports searching movies or not
     */
    movie?: boolean;
    /**
     * Supports searching episodes or not
     */
    episode?: boolean;
    /**
     * Supports searching seasons or not
     */
    season?: boolean;
    /**
     * Supports searching anime or not
     */
    anime?: boolean;
    /**
     * Additional data that must be stored with metadata
     * This will be supplied during createProvider call.
     */
    data?: any;
};
export interface StringKeyValuePair {
    [key: string]: string;
}
export declare type Source = {
    /**
     * Url to the source.
     * Supported types are:
     * A http/s url
     * A magnet url
     */
    url?: string;
    /**
     * Http headers to be sent while resolving/streaming this source
     */
    headers?: StringKeyValuePair;
    /**
     * File/torrent name.
     */
    name?: string;
    /**
     * Size of the file/torrent
     */
    sizeInBytes?: number;
    /**
     * Name of the host of this source (only used when resolved = true)
     */
    host?: string;
    /**
     * If this is a direct link that does not need resolving
     */
    resolved?: boolean;
    /**
     * If the source is subbed
     */
    subbed?: boolean;
    /**
     * If the source is dubbed
     */
    dubbed?: boolean;
    /**
     * Subtitles for this source
     */
    subtitles?: {
        /**
         * Url to the subtitle
         */
        url: string;
        /**
         * ISO 639-1 language code
         */
        lang?: string;
    }[];
    quality?: string;
    /**
     * Height of the video
     */
    height?: number;
    /**
     * Width of the video
     */
    width?: number;
    /**
     * Only for torrents
     */
    seeders?: number;
    /**
     * Only for torrents
     */
    peers?: number;
    /**
     * Deep link to a android package.
     * If only intentUri is given any app capable of handling that uri will launch.
     * If only package is given if the package is installed, it will be launched.
     * If both is given, only the package will be launched and intentUri will be set in intent.
     */
    android?: {
        /**
         * Android package to launch
         */
        packageName?: string;
        /**
         * Uri to pass to android intent
         */
        intentUri?: string;
    };
};
declare type Media = {
    /**
    * Various ids of the content
    */
    ids: Ids;
    /**
     * Various titles of the content
     */
    titles: Titles;
    /**
     * Unix timestamp of release date.
     */
    release?: number;
    /**
     * Url of the content if no id was found for it
     */
    url?: string;
};
export declare type Title = {
    title: string;
    language?: string;
};
/**
 * Various titles of the content.
 */
export declare type Titles = {
    /**
     * Main title
     */
    main: Title;
    /**
     * Original title in it's original language
     */
    original?: Title;
    /**
     * Alternate titles including various languages
     */
    alternate?: Title[];
};
export declare type ExtendedMedia = Media & {
    /**
     * Names of cast members
     */
    cast?: string[];
    /**
     * Names of crew members
     */
    crew?: string[];
    /**
     * True for all standard content that are retrieved from trakt/tmdb.
     */
    standard?: boolean;
    /**
     * True for all standard content that are retrieved from mal/anilist.
     */
    anime?: boolean;
};
export declare type Movie = ExtendedMedia & {};
export declare type Episode = Media & {
    /**
     * Episode number.
     */
    episodeNumber: number;
    /**
     * Season number.
     */
    seasonNumber: number;
    /**
     * Associated show for this episode/season.
     */
    show: Show;
};
export declare type Season = Media & {
    /**
     * Season number.
     */
    seasonNumber: number;
    show: Show;
};
export declare type Show = ExtendedMedia & {};
export declare type Ids = {
    tmdb?: string;
    trakt?: string;
    tvdb?: string;
    imdb?: string;
    mal?: string;
};
export interface Storage {
    /**
     * Clears the local storage
     */
    clear(): void;
    /**
     * Gets the value of the given [key]
     * @param key The key whose value you want to retrieve.
     */
    getItem(key: string): string | null;
    /**
     * Removes the specified [key] from local storage.
     * @param key The key you want to remove.
     */
    removeItem(key: string): void;
    /**
     * Stores a `key` and it's `value` in to the local store.
     * @param key Unique identifier for the new local storage item
     * @param value The value of the item
     */
    setItem(key: string, value: string): void;
}
export declare type HttpRequestHeaders = Record<string, string | number | boolean>;
export declare type HttpResponseHeaders = Record<string, string> & {
    "set-cookie"?: string[];
};
export interface HttpTransformer {
    (data: any, headers?: Record<string, string>): any;
}
export interface HttpAdapter {
    (config: HttpRequestConfig): HttpPromise<any>;
}
export interface HttpBasicCredentials {
    username: string;
    password: string;
}
export interface HttpProxyConfig {
    host: string;
    port: number;
    auth?: {
        username: string;
        password: string;
    };
    protocol?: string;
}
export declare type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'patch' | 'PATCH' | 'purge' | 'PURGE' | 'link' | 'LINK' | 'unlink' | 'UNLINK';
export declare type ResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';
export interface TransitionalOptions {
    silentJSONParsing: boolean;
    forcedJSONParsing: boolean;
    clarifyTimeoutError: boolean;
}
export interface HttpRequestConfig<T = any> {
    url?: string;
    method?: Method;
    baseURL?: string;
    headers?: HttpRequestHeaders;
    params?: any;
    paramsSerializer?: (params: any) => string;
    data?: T;
    timeout?: number;
    timeoutErrorMessage?: string;
    withCredentials?: boolean;
    auth?: HttpBasicCredentials;
    responseType?: ResponseType;
    xsrfCookieName?: string;
    xsrfHeaderName?: string;
    maxContentLength?: number;
    validateStatus?: ((status: number) => boolean) | null;
    maxBodyLength?: number;
    maxRedirects?: number;
    socketPath?: string | null;
    httpAgent?: any;
    httpsAgent?: any;
    cancelToken?: CancelToken;
    decompress?: boolean;
    transitional?: TransitionalOptions;
    signal?: AbortSignal;
}
export interface HttpResponse<T = never> {
    data: T;
    status: number;
    statusText: string;
    headers: HttpResponseHeaders;
    config: HttpRequestConfig<T>;
    request?: any;
}
export interface HttpError<T = never> extends Error {
    config: HttpRequestConfig;
    code?: string;
    request?: any;
    response?: HttpResponse<T>;
    isHttpError: boolean;
    toJSON: () => object;
}
export interface HttpPromise<T = never> extends Promise<HttpResponse<T>> {
}
export interface CancelStatic {
    new (message?: string): Cancel;
}
export interface Cancel {
    message: string;
}
export interface Canceler {
    (message?: string): void;
}
export interface CancelTokenStatic {
    new (executor: (cancel: Canceler) => void): CancelToken;
    source(): CancelTokenSource;
}
export interface CancelToken {
    promise: Promise<Cancel>;
    reason?: Cancel;
    throwIfRequested(): void;
}
export interface CancelTokenSource {
    token: CancelToken;
    cancel: Canceler;
}
export interface HttpInterceptorManager<V> {
    use<T = V>(onFulfilled?: (value: V) => T | Promise<T>, onRejected?: (error: any) => any): number;
    eject(id: number): void;
}
export interface HttpClient {
    defaults: HttpRequestConfig;
    interceptors: {
        request: HttpInterceptorManager<HttpRequestConfig>;
        response: HttpInterceptorManager<HttpResponse>;
    };
    getUri(config?: HttpRequestConfig): string;
    request<T = never, R = HttpResponse<T>>(config: HttpRequestConfig<T>): Promise<R>;
    get<T = never, R = HttpResponse<T>>(url: string, config?: HttpRequestConfig<T>): Promise<R>;
    delete<T = never, R = HttpResponse<T>>(url: string, config?: HttpRequestConfig<T>): Promise<R>;
    head<T = never, R = HttpResponse<T>>(url: string, config?: HttpRequestConfig<T>): Promise<R>;
    options<T = never, R = HttpResponse<T>>(url: string, config?: HttpRequestConfig<T>): Promise<R>;
    post<T = never, R = HttpResponse<T>>(url: string, data?: T, config?: HttpRequestConfig<T>): Promise<R>;
    put<T = never, R = HttpResponse<T>>(url: string, data?: T, config?: HttpRequestConfig<T>): Promise<R>;
    patch<T = never, R = HttpResponse<T>>(url: string, data?: T, config?: HttpRequestConfig<T>): Promise<R>;
}
export interface HttpClientInstance extends HttpClient {
    (config: HttpRequestConfig): HttpPromise;
    (url: string, config?: HttpRequestConfig): HttpPromise;
}
export {};
