import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBilibili,
  faGithub,
  faTelegram,
  faWeixin,
  faXTwitter,
  faZhihu,
} from "@fortawesome/free-brands-svg-icons"
import { faEnvelope, faHeart } from "@fortawesome/free-solid-svg-icons"
import type { Contact } from "@/lib/contacts"
import { cn } from "@/lib/utils"

const iconMap = {
  github: faGithub,
  bilibili: faBilibili,
  zhihu: faZhihu,
  x: faXTwitter,
  mail: faEnvelope,
  telegram: faTelegram,
  wechat: faWeixin,
  heart: faHeart,
} as const

export function ContactIcon({
  icon,
  className,
}: {
  icon: Contact["icon"]
  className?: string
}) {
  return (
    <FontAwesomeIcon
      icon={iconMap[icon]}
      className={cn("size-4", className)}
      fixedWidth
    />
  )
}
