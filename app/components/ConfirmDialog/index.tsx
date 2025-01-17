import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type ConfirmDialogPropsType = {
  renderButton: React.ReactNode;
  onConfirm: () => void;
};

export default function ConfirmDialog(props: ConfirmDialogPropsType) {
  const { renderButton, onConfirm } = props;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{renderButton}</AlertDialogTrigger>

      <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
        <AlertDialogHeader className="bg-amber-100/50 -mx-6 -mt-6 p-6 rounded-t-lg">
          <AlertDialogTitle className="text-amber-900 font-serif">
            確認動作
          </AlertDialogTitle>
        </AlertDialogHeader>

        <AlertDialogDescription className="text-amber-800">
          操作後可能無法復原，確定要繼續嗎？
        </AlertDialogDescription>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-amber-500 hover:bg-amber-600 text-white">
            取消
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-white/80 hover:bg-white border-amber-200 text-amber-900"
            onClick={onConfirm}
          >
            確定
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
