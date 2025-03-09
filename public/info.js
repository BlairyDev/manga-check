let mangaID = localStorage.getItem("manga-id");
let userName = localStorage.getItem("username");

let mangaImg;
let mangaTitle;
let mangaGenres;
let mangaDesc;
let mangaAuthors;
let mangaYear;
let mangaIsLicensed;
let mangaPublishers;
let mangaScanlators;

async function getSeries() {
  try {
    const response = await axios.get("/api/series", {
      params: { id: mangaID },
    });

    let reviews = await getReviews();
    viewReviews(reviews);

    console.log(response.data.title);

    mangaImg = response.data.image.url.original;
    mangaTitle = response.data.title;
    mangaGenres = response.data.genres;
    mangaDesc = response.data.description;
    mangaAuthors = response.data.authors;
    mangaYear = response.data.year;
    mangaIsLicensed = response.data.licensed;
    mangaPublishers = response.data.publishers;
    // mangaScanlators = dont forget to add this use API to get group scanlations

    $(".info__title").text(mangaTitle);

    createList("genre__details", "genres", mangaGenres);
    createList("author__name", "", mangaAuthors);
    createList("artist__name", "", mangaAuthors);
    createList("publisher__name", "", mangaPublishers);

    $(".manga__desc p").text(mangaDesc);
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

function createList(detailContainer, className, mangaData) {
  let container = $(`.${detailContainer}`);

  let ul = $("<ul>", { class: `${className} info__btn` });

  mangaData.forEach((data) => {
    if (
      (detailContainer === "author__name" && data.type === "Artist") ||
      (detailContainer === "artist__name" && data.type === "Author")
    ) {
      console.log("nice");
      return;
    }
    let li = $("<li>");

    let p = $("<p>").text(data.name || data.genre || data.publisher_name);

    li.append(p);
    ul.append(li);
  });

  container.append(ul);
}

async function getReviews() {
  try {
    const response = await axios.get(
      "https://jsonblob.com/api/jsonBlob/1348185479006314496"
    );
    console.log("Fetched Reviews:", response.data);
    return response.data.comments; // Make sure this returns the correct array
  } catch (error) {
    console.log("Error fetching reviews:", error);
    return [];
  }
}

let commentContainer = $(".comment-container");

function viewReviews(reviews) {
  reviews.forEach((userComment) => {
    let comment = $("<div>", { class: "comment" });
    let commentImg = $("<div>", { class: "comment__img" });
    let img = $("<img>", { class: "w-50" }).attr(
      "src",
      "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
    );
    let commentUser = $("<h3>", { class: "comment__user" }).text(
      userComment.username
    );
    let commentText = $("<p>", { class: "" }).text(userComment.comment);

    commentImg.append(img);

    comment.append(commentImg, commentUser, commentText);

    commentContainer.append(comment);
  });
}

let reviewBtn = document.querySelector(".review-btn");

reviewBtn.addEventListener("click", async (event) => {
  let inputReview = document.querySelector(".input-review");

  try {
    let reviews = await getReviews();

    let updatedReviews = {
      comments: [
        ...reviews,
        {
          username: userName,
          comment: inputReview.value,
        },
      ],
    };

    let config = {
      method: "put",
      maxBodyLength: Infinity,
      url: "https://jsonblob.com/api/jsonBlob/1348185479006314496",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(updatedReviews),
    };

    axios
      .request(config)
      .then((response) => {
        console.log("Updated Reviews:", response.data);
 
        viewReviews(response.data.comments);
      })
      .catch((error) => {
        console.log("Error updating reviews:", error);
      });
  } catch (error) {
    console.log("Error in event listener:", error);
  }
});

getSeries();
