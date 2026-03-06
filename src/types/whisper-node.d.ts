declare module "whisper-node" {
  export interface WhisperSegment {
    start: string;
    end: string;
    speech: string;
  }

  export interface WhisperOptions {
    language?: string;
    word_timestamps?: boolean;
    gen_file_txt?: boolean;
    gen_file_subtitle?: boolean;
    gen_file_vtt?: boolean;
    timestamp_size?: number;
  }

  export interface WhisperParams {
    modelName?: string;
    modelPath?: string;
    whisperOptions?: WhisperOptions;
    shellOptions?: { silent?: boolean; async?: boolean };
  }

  export function whisper(
    filePath: string,
    options?: WhisperParams
  ): Promise<WhisperSegment[]>;

  export default whisper;
}
