"use client"
import { useState, useEffect, useRef } from "react";
import { Avatar, Box, Button, Grid2 as Grid, Paper, Popper, Typography } from "@mui/material";
import { YouTube, Google, X } from "@mui/icons-material";
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import { useLoading } from "@/hooks/useLoading";
import OutboundLink from "@/component/OutboundLink";
import AudioPlayer from "@/component/AudioPlayer";
import { Niconico } from "@/component/icons";
import { API_URL, SOUND_URL, GUIDELINE_URL, ICON_URL } from "@/config";

type MusicData = {
  number: number;
  origin: string[];
  title: string;
  titlePronounce: string;
  vocal: string[];
  url: {
    niconico: string;
    youtube: string;
    offvocal: string;
  };
  bpm: string;
  length: string;
  createdAt: string;
  uploadedAt: string;
  tag: string[];
  show: {
    trial: boolean;
    lyrics: boolean;
    list: boolean;
  };
  lyrics: string;
};

const getBgColor = (tag: string[]) => {
  if (tag.includes("東方")) {
    return "#fff0e8";
  } else if (tag.includes("ボカロ(広義)")) {
    return "#e8fcff";
  } else {
    return "#e8fff4";
  }
};

export default function Home() {
  const { setLoading } = useLoading();
  const [musicData, setMusicData] = useState<MusicData[]>([]);
  const [playFlags, setPlayFlags] = useState<{ [k: number]: boolean }>({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const data: MusicData[] = await response.json();
      setMusicData(data);
      const flags: { [k: number]: boolean } = {};
      for (const music of data) {
        if (music.show.trial) {
          flags[music.number] = false;
        }
      }
      setPlayFlags(flags);
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const handleChangeFlag = (n: number) => {
    const flag = !playFlags[n];
    if (flag) {
      const flags: { [k: number]: boolean } = {};
      for (const { number } of musicData) {
        flags[number] = n == number ? true : false;
      }
      setPlayFlags(flags);
    } else {
      playFlags[n] = flag;
      setPlayFlags({...playFlags});
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns: MRT_ColumnDef<MusicData>[] = [
    {
      header: "No.",
      accessorKey: "number",
    },
    {
      header: "試聴",
      Cell: ({ cell }) => {
        const { number, show } = cell.row.original;
        const filename = number.toString().padStart(3, "0").replace(".", "_");
        const url = `${SOUND_URL}/trial/${filename}.mp3`;
        return (
          <>
            {show.trial ? (
              <AudioPlayer 
                src={url}
                playing={playFlags[number]}
                onClick={() => handleChangeFlag(number)}
              />
            ) : (
              <></>
            )}
          </>
        );
      },
    },
    {
      header: "Title",
      Cell: ({ cell }) => {
        const { title, titlePronounce } = cell.row.original;
        return (
          <TitlePopper title={title} pronounce={titlePronounce} />
        );
      },
      minSize: 130,
    },
    {
      header: "Links",
      Cell: ({ cell }) => {
        const { niconico, youtube, offvocal } = cell.row.original.url;
        return (
          <>
            {niconico && (
              <OutboundLink href={niconico}>
                <Button variant="text" startIcon={<Niconico />}>
                  ニコニコ
                </Button>
              </OutboundLink>
            )}
            {youtube && (
              <OutboundLink href={youtube}>
                <Button variant="text" startIcon={<YouTube />}>
                  YouTube
                </Button>
              </OutboundLink>
            )}
            {offvocal && (
              <OutboundLink href={offvocal}>
                <Button variant="text" startIcon={<Google />}>
                  off vocal
                </Button>
              </OutboundLink>
            )}
          </>
        );
      },
    },
    {
      header: "Vocal",
      accessorFn: (cell) => cell.vocal.join("・"),
      minSize: 75,
    },
    {
      header: "原曲",
      Cell: ({ cell }) => (
        <Box sx={{ whiteSpace: "pre-wrap" }}>
          {cell.row.original.origin.join("\n")}
        </Box>
      ),
      minSize: 100,
    },
    // ここに歌詞
    {
      header: "BPM",
      accessorKey: "bpm",
      grow: false,
    },
    {
      header: "長さ",
      accessorKey: "length",
      grow: false,
    },
    {
      header: "制作時期",
      accessorKey: "createdAt",
      grow: false,
    },
    {
      header: "初公開日",
      accessorKey: "uploadedAt",
      grow: false,
    },
    {
      header: "タグ",
      accessorFn: (cell) => cell.tag.join(", "),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: musicData.filter((m) => m.show.list && (m.url.niconico || m.url.youtube))
                   .sort((a, b) => b.number - a.number),
    enablePagination: false,
    enableColumnActions: false,
    muiTableBodyRowProps: { hover: false },
    muiTableBodyCellProps: (props) => ({
      style: {
        backgroundColor: getBgColor(props.row.original.tag),
      },
    }),
    muiBottomToolbarProps: { style: { zIndex: 0 } },
    muiTopToolbarProps: { style: { zIndex: 0 } },
    muiTableContainerProps: { sx: { maxHeight: 800 } },
    defaultColumn: { size: 0 },
    renderBottomToolbar: false,
  });

  const links = [
    {
      label: "ニコニコ１(主に東方)",
      url: "http://www.nicovideo.jp/user/51008840",
      icon: <Niconico />
    },
    {
      label: "ニコニコ２(主にボカロ)",
      url: "http://www.nicovideo.jp/user/119635362",
      icon: <Niconico />
    },
    {
      label: "ニコニ・コモンズ",
      url: "http://commons.nicovideo.jp/user/upload/3346494",
      icon: <Niconico />
    },
    {
      label: "YouTube",
      url: "https://www.youtube.com/c/MiLfy6o6_mei",
      icon: <YouTube />
    },
    {
      label: "Twitter",
      url: "https://twitter.com/Timirufi",
      icon: <X />
    },
    {
      label: "もっと詳しいHP",
      url: "http://locossic.starfree.jp/",
      icon: null,
    },
  ];

  const profile = `ボカロ曲、東方アレンジ、インストオリジナル曲を作ってます。
  ペユドチな曲を作ってます。
  動画・イラスト等もほとんど自分で作っています。
  依頼は受け付けていません。
  楽曲は基本的に自由に使っていいことになっていますが一応下のガイドラインを確認しておいてください。
  (要約の条件(「二次創作の場合やBGMとして使う場合」)に当てはまっていれば要約の部分だけ見れば大丈夫です)`;

  const works = [
    {
      label: "#てぃみ式 コードエディタ",
      url: "https://hyayum.github.io/chord_editor/",
      description: "独自の音楽理論「#てぃみ式」を基にコードの情報を入力して再生したり解析したりできるツール",
    },
    {
      label: "だれでもペユドチ",
      url: "http://locossic.starfree.jp/memo_view?id=56",
      description: "だれでもペユドチができるツール (文字ごとに確率が設定された状態でランダムに文字列を生成できるツール)",
    },
  ];

  return (
    <Grid container spacing={5} alignItems="center" sx={{ m: 5, justifyContent: "center" }}>
      <Grid size={12}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          てぃみ*れの / みるふぃ の簡易版ページ
        </Typography>
      </Grid>
      <Grid size={12}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          名義の使い分け
        </Typography>
        <Typography variant="subtitle1">
          てぃみ*れの：主にボカロ曲で使っているHN
        </Typography>
        <Typography variant="subtitle1">
          みるふぃ：主に東方アレンジで使っているHN
        </Typography>
        <Typography variant="subtitle2" sx={{ mt: 1 }}>
          その他：こよにり(原神)、にゆつぇん(鳴潮) など
        </Typography>
      </Grid>

      <Grid size={5}>
        <Typography variant="h6">
          プロフィール
        </Typography>
        <Avatar src={ICON_URL} />
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          ↑現在使用中のアイコン
        </Typography>
        {profile.split("\n").map((line, i) => (
          <Typography variant="subtitle2" key={i}>
            {line}
          </Typography>
        ))}
        <OutboundLink href={GUIDELINE_URL}>
          <Button variant="text">
            楽曲使用のガイドライン
          </Button>
        </OutboundLink>
      </Grid>

      <Grid size={7}>
        <Typography variant="h6">
          Links
        </Typography>
        {links.map((link) => (
          <Box key={link.label}>
            <OutboundLink href={link.url}>
              <Button variant="text" startIcon={link.icon}>
                {link.label}
              </Button>
            </OutboundLink>
          </Box>
        ))}
      </Grid>

      <Grid size={12}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          楽曲以外の制作物
        </Typography>
        {works.map((work) => (
          <Box key={work.label}>
            <OutboundLink href={work.url}>
              <Button variant="text">
                {work.label}
              </Button>
            </OutboundLink>
            <Typography variant="subtitle2" sx={{ ml: 2, mb: 1 }}>
              {work.description}
            </Typography>
          </Box>
        ))}
      </Grid>

      <Grid size={12}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          楽曲リスト
        </Typography>
        <MaterialReactTable table={table} />
      </Grid>
    </Grid>
  );
}

const TitlePopper = ({ title, pronounce }: { title: string, pronounce: string }) => {
  const textRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Popper
        open={open}
        anchorEl={textRef.current}
        placement="top-start"
      >
        <Paper elevation={3} sx={{ p: 1 }}>
          <Typography variant="subtitle2">
            {pronounce}
          </Typography>
        </Paper>
      </Popper>
      <Box
        ref={textRef}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {title}
      </Box>
    </>
  );
};