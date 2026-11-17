import CodeBlock from "@theme/CodeBlock";

import aiRule from "@site/src/generated/aiRule.json";

type AiRuleProps = {
   frontMatter?: string;
   fileName?: string;
};

function AiRule({ frontMatter, fileName }: AiRuleProps) {
   return (
      <CodeBlock language="markdown" title={fileName}>
         {frontMatter ? `${frontMatter}\n\n${aiRule.content}` : aiRule.content}
      </CodeBlock>
   );
}

export default AiRule;
