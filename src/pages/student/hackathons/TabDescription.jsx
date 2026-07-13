import RichTextViewer from '../../../components/RichTextViewer';

export default function TabDescription({ description }) {
  return (
    <div className="rounded-xl border bg-white p-5 sm:p-6">
      <RichTextViewer content={description} />
    </div>
  );
}
