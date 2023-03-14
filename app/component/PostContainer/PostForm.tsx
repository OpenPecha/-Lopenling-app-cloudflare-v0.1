import { useFetcher, useLoaderData } from "@remix-run/react";
import { Avatar, Button, Textarea, Toast } from "flowbite-react";
import React, { useEffect } from "react";
import Loading from "react-loading";
import ErrorSubmission from "./SubmissionError";
import { createPortal } from "react-dom";
import Post from "./Post";
type QuestionFormProps = {
  postInfo: null | {
    type: string;
    start: number;
    end: number;
    content: string;
  };
  setPostInfo: (e: null | any) => void;
};

const PostForm = ({ postInfo, setPostInfo }: QuestionFormProps, ref: any) => {
  const data = useLoaderData();
  const createPost = useFetcher();
  const [body, setBody] = React.useState("");
  let isFormEmpty = body.length === 0;
  let isPosting =
    createPost.submission && createPost.submission.formData.get("body") !== "";
  function handleSubmit(e) {
    e.preventDefault();
    let lengthOfSelection = postInfo.end - postInfo?.start;
    if (lengthOfSelection > 254) {
      alert("ERROR : selecting more then 255 letter not allowed");
      return null;
    }
    if (postInfo)
      createPost.submit(
        {
          start: postInfo.start,
          end: postInfo.end,
          selectedTextSegment: postInfo.content,
          textId: data?.text?.id,
          topic: data?.text?.name,
          body: body,
          type: postInfo.type,
        },
        {
          method: "post",
          action: "/api/post",
        }
      );
    setPostInfo(null);
  }

  if (isPosting) {
    return createPortal(
      <Post
        creatorUser={data.user}
        time="now"
        likedBy={[]}
        replyCount={0}
        id={Math.random()}
        isSolved={false}
        postContent={createPost.submission.formData.get("body") as string}
        topicId={null}
        type={
          createPost.submission.formData.get("type") as "question" | "comment"
        }
        handleSelection={null}
        selectedPost={null}
      />,

      document.getElementById("temporaryPost")
    );
  }
  if (createPost.data?.error && !postInfo)
    <ErrorSubmission errorMessage={createPost.data.error.message} />;
  if (!postInfo?.type) return null;
  return (
    <section>
      <div className="inline-flex items-start justify-start">
        <p className="text-base font-medium leading-tight text-gray-900 mb-3 capitalize">
          {postInfo.type === "question" ? "ask question" : "new comment"}
        </p>
      </div>
      <createPost.Form
        ref={ref}
        className="flex flex-col gap-3"
        onSubmit={handleSubmit}
      >
        {data.user ? (
          <>
            <Textarea
              placeholder="what are your thoughts?"
              autoFocus
              name="body"
              onChange={(e) => setBody(e.target.value)}
              style={{ height: 108 }}
              className=" w-full bg-gray-50 focus:border-0 focus:outline-0 "
            ></Textarea>
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setPostInfo(null)}
                color=""
                className="bg-gray-200 text-black"
                size="xs"
              >
                cancel
              </Button>
              <Button
                onClick={handleSubmit}
                color=""
                size="xs"
                className="bg-green-400 text-white"
                disabled={isFormEmpty}
              >
                post
              </Button>
            </div>
          </>
        ) : (
          <div className="text-red-600">You must login first !</div>
        )}
      </createPost.Form>
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700"></hr>
    </section>
  );
};

export default React.forwardRef(PostForm);
