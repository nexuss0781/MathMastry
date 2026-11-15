import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { cn } from "@/lib/utils";

export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-math min-w-0 text-[0.95rem] leading-relaxed", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex]}
        components={{
          a: ({ href, children: content }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
            >
              {content}
            </a>
          ),
          h1: ({ children: content }) => <h1 className="mb-3 mt-5 text-2xl first:mt-0">{content}</h1>,
          h2: ({ children: content }) => <h2 className="mb-2 mt-6 text-xl first:mt-0">{content}</h2>,
          h3: ({ children: content }) => (
            <h3 className="mb-1.5 mt-5 text-[0.95rem] font-semibold uppercase tracking-wider text-muted first:mt-0">
              {content}
            </h3>
          ),
          p: ({ children: content }) => <p className="my-3">{content}</p>,
          ul: ({ children: content }) => <ul className="my-3 list-disc space-y-1 pl-5">{content}</ul>,
          ol: ({ children: content }) => <ol className="my-3 list-decimal space-y-1 pl-5">{content}</ol>,
          li: ({ children: content }) => <li className="pl-0.5">{content}</li>,
          blockquote: ({ children: content }) => (
            <blockquote className="my-4 border-l-2 border-accent/50 bg-accent/[0.04] py-1 pl-4 text-[0.92em] text-muted">
              {content}
            </blockquote>
          ),
          table: ({ children: content }) => (
            <div className="my-4 overflow-x-auto">
              <table className="w-full border-collapse text-sm">{content}</table>
            </div>
          ),
          th: ({ children: content }) => (
            <th className="border-b border-line px-2 py-1.5 text-left font-medium">{content}</th>
          ),
          td: ({ children: content }) => <td className="border-b border-line/60 px-2 py-1.5">{content}</td>,
          code: ({ className: codeClass, children: content }) => {
            const block = codeClass?.includes("language-");
            if (block) {
              return <code className={cn("block overflow-x-auto text-xs", codeClass)}>{content}</code>;
            }
            return <code className="rounded bg-ink/[0.06] px-1 py-0.5 text-[0.88em]">{content}</code>;
          },
          pre: ({ children: content }) => (
            <pre className="my-4 overflow-x-auto rounded-[var(--radius-sm)] border border-line bg-ink/[0.03] p-3 text-xs">
              {content}
            </pre>
          ),
          hr: () => <hr className="my-6 border-line" />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
