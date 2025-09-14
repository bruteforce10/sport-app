"use client"
import Image from 'next/image'
import React from 'react'

const AvatarMemberSection = ({members}) => {

  return (
    <div className="flex items-center space-x-2">
    <div className="flex -space-x-2">
      {members.slice(0, 5).map((i) => (
        <Image key={i.id} src={i.user.avatar} alt={"avatar"} width={32} height={32} className="rounded-full" />
      ))}
      {members.length > 5 && (
        <div className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white">{members.length}+</div>
      )}
    </div>
    <span className="text-sm text-gray-600">Anggota</span>
  </div>
  )
}

export default AvatarMemberSection