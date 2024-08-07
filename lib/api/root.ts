import { adRouter } from "./routes/ad"
import { articleRouter } from "./routes/article"
import { articleCommentRouter } from "./routes/article-comment"
import { downloadRouter } from "./routes/download"
import { downloadCommentRouter } from "./routes/download-comment"
import { downloadFileRouter } from "./routes/download-file"
import { mediaRouter } from "./routes/media"
import { pageRouter } from "./routes/page"
import { settingRouter } from "./routes/setting"
import { topicRouter } from "./routes/topic"
import { userRouter } from "./routes/user"
import { userLinkRouter } from "./routes/user-link"
import { createCallerFactory, createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ad: adRouter,
  article: articleRouter,
  articleComment: articleCommentRouter,
  download: downloadRouter,
  downloadComment: downloadCommentRouter,
  downloadFile: downloadFileRouter,
  media: mediaRouter,
  page: pageRouter,
  setting: settingRouter,
  topic: topicRouter,
  user: userRouter,
  userLink: userLinkRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
