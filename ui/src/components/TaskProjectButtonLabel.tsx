import SplitscreenIcon from "@mui/icons-material/Splitscreen";
import Typography from "@mui/material/Typography";

interface TaskProjectButtonLabelProps {
  selectedProject: { title: string; is_default: boolean } | undefined;
  selectedSection: { title: string; is_default: boolean } | undefined;
}

export default function TaskProjectButtonLabel({
  selectedProject,
  selectedSection,
}: TaskProjectButtonLabelProps) {
  return (
    <>
      <Typography
        fontSize={"small"}
        textOverflow={"ellipsis"}
        overflow={"hidden"}
      >
        {selectedProject?.title}
      </Typography>
      {!selectedSection?.is_default && (
        <>
          <Typography>&nbsp;/&nbsp;</Typography>
          <SplitscreenIcon fontSize="small" />
          <Typography
            fontSize={"small"}
            textOverflow={"ellipsis"}
            overflow={"hidden"}
          >
            {selectedSection?.title}
          </Typography>
        </>
      )}
    </>
  );
}
