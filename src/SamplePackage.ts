import { Package, ProviderMetadata, Provider, Episode, Movie, Season, Show, Source, SourceTypes }
    from 'package-sdk';

interface BaseProvider extends Provider {

    metadata: ProviderMetadata

}

/**
 * Example provider
 */
export class Provider1 implements BaseProvider {

    metadata: ProviderMetadata = {
        name: 'SampleProvider',
        sourceTypes: [SourceTypes.FREE_HOSTER],
        movie: true,
        episode: true,
        season: true,
        anime: false,
        languages: ["en"]
    };

    searchMovie(movie: Movie): Promise<Source[]> {
        return this.search(movie)
    }
    searchEpisode(episode: Episode): Promise<Source[]> {
        return this.search(episode.show)
    }
    searchSeason(season: Season): Promise<Source[]> {
        return this.search(season.show)
    }

    async search(media: Movie | Show): Promise<Source[]> {

        var name = media.titles.main.title;

        console.log(`Searching ${name}`);

        const axios = env.http.create();
        const data = await axios.get('https://httpbin.org/get').then(i => i.data) as any;

        const url = data.url

        env.storage.setItem('token', `token-${url}`);
        console.log(env.storage.getItem('token'))

        const sources: [Source] = [
            {
                url: 'https://example.org',
                name: 'BigBuckBunny.mp4'
            }
        ]

        return sources;
    }

}

const providers: BaseProvider[] = [
    new Provider1()
];

/**
 * Example package implements the Package interface
 */
export class SamplePackage implements Package {

    public createProviderMetadata(): Promise<ProviderMetadata[]> {
        return Promise.resolve(providers.map(provider => provider.metadata));
    }

    public createProvider(metadata: ProviderMetadata): Promise<Provider> {

        var provider = providers.filter(provider => provider.metadata.name == metadata.name)[0];

        return Promise.resolve(provider);
    }
  
}

