import { LoaderArgs, LoaderFunction } from "@remix-run/node";
import {
  Await,
  Outlet,
  useFetcher,
  useLoaderData,
  useOutletContext,
} from "@remix-run/react";
import { useEditor } from "@tiptap/react";
import { getPage } from "~/model/page";
import * as Extension from "~/features/Editor/tiptap";
import {
  openSuggestionState,
  selectedPostThread,
  selectedSuggestionThread,
  selectedTextOnEditor,
  textInfo,
} from "~/states";
import { useRecoilState, useSetRecoilState } from "recoil";
import { Suspense, useCallback, useEffect, useState } from "react";
import { DiffMatchPatch, isSmallScreen } from "~/lib";
import Header from "~/component/Layout/Header";

import Split from "react-split";
import { isMobile, isTablet } from "react-device-detect";
import { EditorContainer } from "~/features/Editor";
import { SuggestionContainer, SuggestionForm } from "~/features/Suggestion";
import { getUserSession } from "~/services/session.server";
import { findAllSuggestionByPageId } from "~/model/suggestion";
export const loader: LoaderFunction = async ({
  request,
  params,
}: LoaderArgs) => {
  let textId = params.textId as string;
  let order = params.pageId as string;
  let page = await getPage(parseInt(textId), parseInt(order));
  let user = await getUserSession(request);
  const suggestions = await findAllSuggestionByPageId(page.id);
  return { page, text: page?.text, user, suggestions };
};

export default function Page() {
  const data = useLoaderData<typeof loader>();
  const [showImage, setShowImage] = useState();
  const { user } = data;
  let content = data.page.content;
  const [suggestionSelected, suggestionSelector] = useRecoilState(
    selectedSuggestionThread
  );
  const postSelector = useSetRecoilState(selectedPostThread);
  const setSelectionRange = useSetRecoilState(selectedTextOnEditor);
  const setTextName = useSetRecoilState(textInfo);

  const [openSuggestion, setOpenSuggestion] =
    useRecoilState(openSuggestionState);
  function suggestionSetter(id: string) {
    suggestionSelector({
      id: id,
    });
  }
  function postSetter(id: string) {
    postSelector({
      id: id,
    });
  }
  const [contentData, setContent] = useState("");
  useEffect(() => {
    setContent(content);
  }, []);

  const getQuery = useCallback(
    (newContent: string) => {
      let oldContent = contentData;
      const dmp = new DiffMatchPatch();
      if (oldContent !== newContent) {
        const changes = dmp.diff_main(oldContent, newContent);
        const patch = dmp.patch_make(changes);
        let query = dmp.patch_toText(patch);
        return query;
      }
      return null;
    },
    [contentData]
  );
  const saveTextFetcher = useFetcher();
  const saveData = async (patch: string) => {
    const formData = new FormData();
    formData.append("textId", data.text?.id);
    formData.append("pageId", data.page?.id);
    formData.append("patch", JSON.stringify(patch));
    saveTextFetcher.submit(formData, {
      method: "POST",
      action: "/api/text",
    });
  };

  let editor = useEditor(
    {
      extensions: [
        Extension.Document,
        Extension.Paragraph,
        Extension.Text,
        Extension.Bold,
        Extension.FontFamily,
        Extension.TextStyle,
        Extension.SearchAndReplace.configure({
          searchResultClass: "search",
          caseSensitive: false,
          disableRegex: false,
        }),
        Extension.HardBreak.configure({
          HTMLAttributes: {
            class: "pageBreak",
          },
        }),
        Extension.Highlight.configure({
          HTMLAttributes: {
            class: "highlight",
          },
        }),
        Extension.Suggestion(suggestionSetter).configure({
          HTMLAttributes: {
            class: "suggestion",
          },
        }),
        Extension.PostMark(postSetter).configure({
          HTMLAttributes: {
            class: "post",
          },
        }),
      ],
      editable: true,
      editorProps: Extension.editorProps,
      onSelectionUpdate: ({ editor }) => {
        let from = editor.state.selection.from;
        let to = editor.state.selection.to;
        setSelectionRange({
          type: "",
          start: from,
          end: to,
          content: editor?.state.doc.textBetween(from, to, ""),
        });
        setOpenSuggestion(false);
        if (!editor.isActive("suggestion")) suggestionSelector({ id: "" });
        if (!editor.isActive("post")) postSelector({ id: "" });
      },
      onUpdate: async ({ editor }) => {
        let newContent = editor.getHTML();
        let query = getQuery(newContent);
        if (query && newContent.length > 10 && user) saveData(query);
      },
      onCreate: async ({ editor }) => {
        setTextName({ name: data?.text.name, id: data?.text.id });
      },
    },
    []
  );
  const [textHeight, setTextHeight] = useState(90);
  useEffect(() => {
    if (isSmallScreen) {
      setTextHeight(40);
    }
  }, [isSmallScreen]);
  const toggleImage = (e) => {
    setShowImage(e.target.checked);
  };
  return (
    <>
      <Header editor={editor} />
      <div style={{ height: 100 }}></div>
      <Split
        minSize={isMobile ? 100 : 350}
        maxSize={750}
        className="split flex-1 flex flex-col lg:flex-row max-w-6xl mx-auto"
        direction={isMobile ? "vertical" : "horizontal"}
        sizes={isMobile ? [50, 50] : isTablet ? [60, 40] : [65, 35]}
      >
        <div>
          <input
            id="imageToggle"
            type="checkbox"
            className="mr-2 cursor-pointer mb-2"
            onChange={toggleImage}
          />
          <label htmlFor="imageToggle" className="cursor-pointer mb-2">
            show Image
          </label>
          {showImage && (
            <img
              alt="Text Image"
              src={data.page.imageUrl}
              className=""
              style={{ border: "1px solid gray" }}
            />
          )}
          <div
            style={{
              maxHeight: `${textHeight}vh`,
              overflowY: "scroll",
              overflowX: "hidden",
              scrollbarWidth: "none",
              width: "100%",
            }}
            id="textEditorContainer"
          >
            <EditorContainer
              editor={editor}
              isSaving={false}
              content={content}
            />
          </div>
        </div>
        <div
          className={`lg:h-screen flex-1 overflow-y-auto pt-3  w-full bg-white dark:bg-gray-700 lg:sticky lg:top-0 rounded-sm`}
        >
          {openSuggestion || suggestionSelected?.id ? (
            <SuggestionForm editor={editor} />
          ) : (
            <Outlet context={{ user: user, editor, text: data.page }} />
          )}
          {suggestionSelected?.id ? (
            <Suspense fallback={<div>loading</div>}>
              <Await resolve={data.suggestions}>
                {(data) => (
                  <SuggestionContainer editor={editor} suggestions={data} />
                )}
              </Await>
            </Suspense>
          ) : null}
        </div>
      </Split>
    </>
  );
}