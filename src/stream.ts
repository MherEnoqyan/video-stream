import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

ffmpeg(process.argv[2], { timeout: 432000 }).addOptions([
    '-profile:v baseline',
    '-level 3.0', 
    '-s 640x360',          
    '-start_number 0',     
    '-hls_time 30',        
    '-hls_list_size 0',   
    '-f hls',             
    `-hls_base_url ${ process.argv[3]}/${ process.argv[4]}/`               
  ]).output(`${ process.argv[4]}/${ process.argv[5]}`).run();