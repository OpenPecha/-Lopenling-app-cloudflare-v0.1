import { ActionFunction, json } from "@remix-run/server-runtime";
import { trigerUpdate } from "~/lib";
import {
  findSuggestionByUserLiked,
  findSuggestionWithMostLikes,
  updateSuggestionLike,
} from "~/model/suggestion";
import { getUserSession } from "~/services/session.server";

export const action: ActionFunction = async ({ request }) => {
  let user = await getUserSession(request);
  const formData = await request.formData();
  let Obj = Object.fromEntries(formData);
  let id = Obj.id as string;

  let threadId = Obj.threadId as string;

  const likedUsers = await findSuggestionByUserLiked(id, user.id);
  try {
    let update = await updateSuggestionLike(id, user.id, likedUsers === null);
    if (update) {
      let highestLiked = await findSuggestionWithMostLikes(threadId);
      if (highestLiked?.textId) {
        await trigerUpdate(user, highestLiked.textId);
      }
      return {
        highestLiked: highestLiked,
        likedBy: update,
      };
    }
    return true;
  } catch (e) {
    console.log(e);
  }
  return { success: true };
};
