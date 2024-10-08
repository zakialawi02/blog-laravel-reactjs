import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Adsense } from "@ctrl/react-adsense";
import GuestLayout from "@/Layouts/GuestLayout";
import Prism from "prismjs";
import "/public/assets/css/prism.css";
import "/public/assets/js/prism.js";
import SharePost from "@/Components/Element/Button/SharePost";
import TagsPost from "@/Components/Element/Button/TagsPost";
import CardAsidePost from "@/Components/Element/Card/CardAsidePost";
import axios from "axios";
import SkeletonOneLine from "@/Components/Element/Skeleton/SkeletonOneLine";
import CommentArticle from "@/Components/Fragment/CommentArticle";
import CardPost2 from "@/Components/Element/Card/CardPost2";

const SinglePost = ({ article }) => {
    const [loading, setLoading] = useState(true);
    const [popularPosts, setPopularPosts] = useState([]);
    const [randomPosts, setRandomPosts] = useState([]);
    const [relatedPosts, setRelatedPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);

    const pathname = window.location.pathname;
    const segments = pathname.split("/").filter((segment) => segment !== "");
    const secondSegment = segments[1] || "";

    const getPopularPosts = async () => {
        const res = await axios
            .get(route("api.article.popular") + "?max=4")
            .then((res) => {
                setPopularPosts(res.data);
            })
            .catch((err) => {
                console.error(err);
                setPopularPosts([]);
            });
    };

    const getRandomPosts = async () => {
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

    const getRelatedPosts = async () => {
        const res = await axios
            .get(route("api.article.related") + "?slug=" + article.slug)
            .then((res) => {
                setRelatedPosts(res.data);
            })
            .catch((err) => {
                console.error(err);
                setRelatedPosts([]);
            });
    };

    const getCategories = async () => {
        const res = await axios
            .get(route("api.categories") + "?max=7&random=true")
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                console.error(err);
                setCategories([]);
            });
    };

    const getTags = async () => {
        const res = await axios
            .get(route("api.tags") + "?max=20")
            .then((res) => {
                setTags(res.data);
            })
            .catch((err) => {
                console.error(err);
                setTags([]);
            });
    };

    const fetchData = async () => {
        getPopularPosts()
            .then(() => getCategories())
            .then(() => getTags())
            .then(() => getRandomPosts())
            .then(() => getRelatedPosts())
            .then(() => setLoading(false))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        Prism.highlightAll();

        fetchData();

        const fetchAndSendData = async () => {
            const urlSlug = window.location.href.split("/").pop();
            try {
                // Mendapatkan IP pengguna
                const response = await axios.get("https://ipinfo.io/json");
                const ip = response.data.ip;
                // Mengirim data ke backend
                const result = await axios.post(route("api.hitVisitor"), {
                    slug: urlSlug,
                    ip: ip,
                });
                // Menampilkan hasil jika diperlukan
                console.log(result.data);
            } catch (error) {
                console.error("Error save stats...");
            }
        };

        fetchAndSendData();
    }, []);

    return (
        <>
            <Head>
                <title>{article.meta_title}</title>
                <meta name="description" content={article.meta_description} />
                <meta
                    name="keywords"
                    content={`${article.meta_keywords} zakialawi, blog, post, personal, web, developer, laravel, wep programming, webgis, gis, geospatial, surveyor, tutorials, tips, ahmad zaki alawi, geomatika, geomatics, geography`}
                />

                <meta itemprop="name" content="zakialawi" />
                <meta
                    itemprop="description"
                    content={article.meta_description}
                />
                <meta itemprop="image" content={`${article.cover}`} />

                <meta property="og:type" content="website" />
                <meta
                    property="og:title"
                    content={`${article.title} | zakialawi`}
                />
                <meta property="og:description" content={article.excerpt} />
                <meta
                    property="og:image"
                    content={`https://zakialawi.com${article.cover}`}
                />
                <meta property="og:url" content={window.location.href} />

                <meta name={article.user.username + ", Ahmad Zaki Alawi"} />
                <meta
                    name="copyright"
                    content={article.user.username + ", Ahmad Zaki Alawi"}
                />
                <meta name="robots" content="index, follow" />
                <meta name="googlebot" content="index, follow" />
            </Head>

            <GuestLayout className="container w-full p-6 md:p-10">
                <div className="mt-6">
                    <div id="breadcrumb" className="">
                        <nav aria-label="breadcrumb">
                            <ol className="flex flex-row flex-wrap items-center">
                                <li className="">
                                    <Link
                                        className="text-frontend-dark hover:text-frontend-accent breadcrumb-next"
                                        href="/"
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="">
                                    <Link
                                        className="text-frontend-dark hover:text-frontend-accent breadcrumb-next"
                                        href="/blog"
                                    >
                                        Blog
                                    </Link>
                                </li>
                                <li className="">
                                    <Link
                                        className="text-frontend-dark hover:text-frontend-accent breadcrumb-next"
                                        href={route(
                                            "article.year",
                                            secondSegment
                                        )}
                                    >
                                        {secondSegment}
                                    </Link>
                                </li>
                                <li className="">
                                    <Link
                                        className="text-frontend-dark hover:text-frontend-accent breadcrumb-next"
                                        href={route(
                                            "article.category",
                                            article?.category?.slug ||
                                                "uncategorized"
                                        )}
                                    >
                                        {article?.category?.category ||
                                            "Uncategorized"}
                                    </Link>
                                </li>
                                <li className="">
                                    <Link
                                        className="text-frontend-dark hover:text-frontend-accent"
                                        aria-current="page"
                                        href="#"
                                    >
                                        {article.title}
                                    </Link>
                                </li>
                            </ol>
                        </nav>
                    </div>

                    <div
                        id="main"
                        className="flex flex-col flex-wrap flex-auto flex-grow gap-4 md:flex-row text-frontend-dark"
                    >
                        <div
                            id="post"
                            className="w-full md:w-[60%] md:flex-grow"
                        >
                            <div id="main-content" className="">
                                <div
                                    id="post-header"
                                    className="py-1 my-2 mb-3"
                                >
                                    <h1 className="mb-2 text-3xl font-bold">
                                        {article.title}
                                    </h1>
                                    <div className="inline-flex items-center">
                                        <Link
                                            href={route(
                                                "article.user",
                                                article.user.username
                                            )}
                                            className="inline-flex items-center after:content-['.'] after:mx-2 after:top-[-3px] after:relative after:px-1 after:font-black after:text-frontend-secondary  hover:text-frontend-primary gap-1"
                                            target="_blank"
                                        >
                                            <img
                                                className="w-6"
                                                src={
                                                    article.user
                                                        .profile_photo_path
                                                }
                                                alt="author"
                                            />
                                            {article.user.username}
                                        </Link>
                                        <Link
                                            href={route("article.month", {
                                                year: article.published_at.substring(
                                                    0,
                                                    4
                                                ),
                                                month: article.published_at.substring(
                                                    5,
                                                    7
                                                ),
                                            })}
                                            className="hover:text-frontend-primary"
                                            target="_blank"
                                        >
                                            {new Date(
                                                article.created_at
                                            ).toDateString("en-US", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div id="feature-image" className="mb-3">
                                <img
                                    className="max-h-[26rem] w-full rounded-lg object-cover object-center"
                                    src={article.cover}
                                    alt="Feature image"
                                    loading="lazy"
                                    decoding="async"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src =
                                            "/assets/img/image-placeholder.webp";
                                    }}
                                />
                            </div>

                            <div
                                id="post-content"
                                className="min-h-[50vh] text-lg"
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: article.content,
                                    }}
                                />
                            </div>

                            <div
                                id="ads-article"
                                className="flex justify-center p-2"
                            >
                                <Adsense
                                    style={{
                                        display: "block",
                                        width: "100%",
                                        height: "auto",
                                        textAlign: "center",
                                    }}
                                    layout="in-article"
                                    format="fluid"
                                    client="ca-pub-8778037825157711"
                                    slot="1595355101"
                                    responsive="true"
                                />
                            </div>

                            <div className="py-1 my-2 border-b-2 border-frontend-dark border-opacity-40"></div>

                            <div className="post-bottom">
                                <div className="flex items-center justify-between text-frontend-secondary">
                                    <div className="">
                                        <TagsPost tags={article.tags} />
                                    </div>

                                    <div id="share" className="text-2xl">
                                        <SharePost />
                                    </div>
                                </div>
                            </div>

                            <div id="author"></div>

                            <div className="py-1 my-2 border-b-2 border-frontend-dark border-opacity-40"></div>

                            {/* Related Blog Post  */}
                            {relatedPosts != [] && (
                                <section className="container px-3 py-6 fluid md:px-2">
                                    <h2 className="mb-5 text-2xl font-bold">
                                        Related Posts
                                    </h2>

                                    {loading && <SkeletonOneLine height={40} />}

                                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                                        {!loading && relatedPosts && (
                                            <>
                                                {relatedPosts.map(
                                                    (post, index) => (
                                                        <CardPost2
                                                            key={index}
                                                            title={post.title}
                                                            category={
                                                                post?.category
                                                                    ?.category
                                                            }
                                                            link={route(
                                                                "article.show",
                                                                {
                                                                    year: post.published_at.substring(
                                                                        0,
                                                                        4
                                                                    ),
                                                                    slug: post.slug,
                                                                }
                                                            )}
                                                            cover={post.cover}
                                                        />
                                                    )
                                                )}
                                            </>
                                        )}
                                    </div>
                                </section>
                            )}

                            <div className="mt-3">
                                <CommentArticle />
                            </div>
                        </div>

                        <div
                            id="sidebar"
                            className="w-full md:w-[30%] mt-10 md:mt-8 sticky md:h-full top-5"
                        >
                            <CardAsidePost id="popular-post">
                                <div className="text-xl font-bold text-center">
                                    <h3>Popular Posts</h3>
                                </div>

                                <CardAsidePost.Body>
                                    {loading && (
                                        <>
                                            <SkeletonOneLine height={16} />
                                            <SkeletonOneLine height={16} />
                                            <SkeletonOneLine height={16} />
                                            <SkeletonOneLine height={16} />
                                            <SkeletonOneLine height={16} />
                                        </>
                                    )}

                                    {!loading && popularPosts && (
                                        <>
                                            {popularPosts.map((post, index) => (
                                                <CardAsidePost.ContentArticle
                                                    key={index}
                                                    article={post}
                                                />
                                            ))}
                                        </>
                                    )}

                                    {!loading && !popularPosts && (
                                        <p className="my-2 text-center font-regular">
                                            No Popular Posts Available
                                        </p>
                                    )}
                                </CardAsidePost.Body>
                            </CardAsidePost>

                            <div
                                id="ads-aside1"
                                className="flex justify-center"
                            >
                                <Adsense
                                    style={{
                                        display: "block",
                                        width: "90%",
                                        height: "100%",
                                        textAlign: "center",
                                    }}
                                    client="ca-pub-8778037825157711"
                                    slot="3976288163"
                                    responsive="true"
                                    format="auto"
                                />
                            </div>

                            <CardAsidePost id="categories">
                                <div className="text-xl font-bold text-center">
                                    <h3>Categories</h3>
                                </div>

                                <CardAsidePost.Body>
                                    {loading && (
                                        <>
                                            <SkeletonOneLine height={6} />
                                            <SkeletonOneLine height={6} />
                                            <SkeletonOneLine height={6} />
                                            <SkeletonOneLine height={6} />
                                            <SkeletonOneLine height={6} />
                                        </>
                                    )}

                                    <div className="flex flex-wrap">
                                        {!loading && categories && (
                                            <ul className="flex flex-col gap-3 p-2">
                                                {categories.map(
                                                    (item, index) => (
                                                        <li key={index}>
                                                            <Link
                                                                href={route(
                                                                    "article.category",
                                                                    {
                                                                        slug: item.slug,
                                                                    }
                                                                )}
                                                                className="font-bold hover:text-frontend-primary"
                                                            >
                                                                <i className="mr-2 text-xl ri-skip-right-line text-info"></i>
                                                                {item.category}
                                                            </Link>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        )}

                                        {!loading && !categories && (
                                            <p className="my-2 text-center font-regular">
                                                No Category Available
                                            </p>
                                        )}
                                    </div>
                                </CardAsidePost.Body>
                            </CardAsidePost>

                            <CardAsidePost id="popular-post">
                                <div className="text-xl font-bold text-center">
                                    <h3>Tags</h3>
                                </div>

                                {loading && <SkeletonOneLine height={24} />}

                                <CardAsidePost.Body>
                                    {!loading && tags && (
                                        <>
                                            <div className="flex flex-wrap">
                                                {tags.map((tag, index) => (
                                                    <CardAsidePost.ContentBadge
                                                        key={index}
                                                        data={tag}
                                                    />
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {!loading && !tags && (
                                        <p className="my-2 text-center font-regular">
                                            No Tags Available
                                        </p>
                                    )}
                                </CardAsidePost.Body>
                            </CardAsidePost>
                        </div>
                    </div>

                    <div id="ads-bottom2" className="flex justify-center">
                        <Adsense
                            style={{
                                display: "block",
                                width: "80%",
                                height: "90px",
                                marginTop: "50px",
                                textAlign: "center",
                            }}
                            client="ca-pub-8778037825157711"
                            slot="9879351535"
                            responsive="true"
                            format="auto"
                        />
                    </div>

                    {/* Random Blog Post  */}
                    {randomPosts != [] && (
                        <section className="container px-3 py-10 fluid md:px-4">
                            <h2 className="mb-5 text-2xl font-bold">
                                You Missed
                            </h2>

                            {loading && <SkeletonOneLine height={40} />}

                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                                {!loading && randomPosts && (
                                    <>
                                        {randomPosts.map((post, index) => (
                                            <CardPost2
                                                key={index}
                                                title={post.title}
                                                category={
                                                    post?.category?.category
                                                }
                                                link={route("article.show", {
                                                    year: post.published_at.substring(
                                                        0,
                                                        4
                                                    ),
                                                    slug: post.slug,
                                                })}
                                                cover={post.cover}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        </section>
                    )}
                </div>
            </GuestLayout>
        </>
    );
};

export default SinglePost;
