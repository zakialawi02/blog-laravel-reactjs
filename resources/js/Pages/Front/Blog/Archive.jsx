import CardPost2 from "@/Components/Element/Card/CardPost2";
import PaginationPost from "@/Components/Element/Pagination/PaginationPost";
import DisplayPostGrid from "@/Components/Fragment/DisplayPostGrid";
import GuestLayout from "@/Layouts/GuestLayout";
import { Adsense } from "@ctrl/react-adsense";
import { Head } from "@inertiajs/react";
import { useState } from "react";
import { useEffect } from "react";

const Archive = ({ articles }) => {
    const [randomPosts, setRandomPosts] = useState([]);
    const pathname = window.location.pathname;
    const segments = pathname.split("/").filter((segment) => segment !== "");
    const parentSegment = segments[1] || "";
    const archiveSegment = segments[2] || "";

    const gethRandomPosts = async () => {
        const res = await axios
            .get(route("api.article.random") + "?max=4")
            .then((res) => {
                setRandomPosts(res.data);
            })
            .catch((err) => {
                console.error(err);
                setRandomPosts([]);
            });
    };

    useEffect(() => {
        gethRandomPosts();
    }, []);

    return (
        <>
            <Head>
                <title>{`Post by ${
                    parentSegment == "user"
                        ? archiveSegment
                        : "tag " + archiveSegment
                }`}</title>
                <meta
                    name="description"
                    content={`Blog Post by ${parentSegment} ${archiveSegment} | zakialawi website`}
                />
                <meta
                    name="keywords"
                    content="zakialawi, blog, personal, web, developer, laravel, wep programming, webgis, gis, geospatial, surveyor, tutorials, tips, ahmad zaki alawi, geomatika, geomatics, geography"
                />

                <meta property="og:title" content="Blog of zakialawi website" />
                <meta
                    property="og:description"
                    content={`Blog Post by ${parentSegment} ${archiveSegment} | zakialawi website | Discover the latest stories, thoughts and inspiration.`}
                />
                <meta property="og:image" content="/favicon.png" />
                <meta property="og:url" content={window.location.href} />

                <meta name="author" content="Ahmad Zaki Alawi" />
                <meta name="copyright" content="Ahmad Zaki Alawi" />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />

                <link rel="canonical" href={window.location.href} />
            </Head>

            <GuestLayout>
                {/* Recent Blog Post  */}
                <section className="container px-6 py-10 fluid md:px-4">
                    <div className="mb-6 text-3xl font-semibold">
                        <h2>Archive : {archiveSegment.toUpperCase()}</h2>
                        <div className="w-[50%] md:w-[84%] -translate-y-4 float-end h-[4px] bg-gradient-to-r from-transparent to-frontend-secondary -z-1"></div>
                    </div>

                    <DisplayPostGrid articles={articles} />

                    <div className="flex items-center justify-end">
                        <PaginationPost
                            links={articles.links}
                            current={articles.current_page}
                            last={articles.last_page}
                        />
                    </div>
                </section>

                <div id="ads-bottom" className="flex justify-center">
                    <Adsense
                        style={{
                            display: "block",
                            width: "80%",
                            height: "90px",
                            textAlign: "center",
                        }}
                        client="ca-pub-8778037825157711"
                        slot="9879351535"
                        responsive="true"
                        format="auto"
                    />
                </div>

                {/* Random Blog Post  */}
                {randomPosts.length > 0 && (
                    <section className="container px-6 py-6 fluid md:px-4">
                        <h2 className="mb-5 text-2xl font-bold">You Missed</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                            {randomPosts.map((post, index) => (
                                <CardPost2
                                    key={index}
                                    title={post.title}
                                    category={post?.category?.category}
                                    link={route("article.show", {
                                        year: post.published_at.substring(0, 4),
                                        slug: post.slug,
                                    })}
                                    cover={post.cover}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </GuestLayout>
        </>
    );
};

export default Archive;
