import { Card } from "@/components/ui/card";

type FormSectionPropsType = {
  title: string;
  content: React.ReactNode;
};

export default function FormSection(props: FormSectionPropsType) {
  const { title, content } = props;

  return (
    <section>
      <h3 className="text-lg font-semibold text-amber-800 mb-4">{title}</h3>

      <Card className="p-6 border-amber-200 bg-amber-50/30">{content}</Card>
    </section>
  );
}
