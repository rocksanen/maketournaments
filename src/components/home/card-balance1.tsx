import { Card, CardBody } from "@nextui-org/react";
import React from "react";
import { Community } from "../icons/community";

export const CardBalance1 = () => {

  
  return (
    <Card className="xl:max-w-sm bg-primary rounded-xl shadow-md px-3 w-full">
      <CardBody className="py-5">
        <div className="flex gap-2.5">
          <Community />
          <div className="flex flex-col">
            <span className="text-white">Overall win percentage</span>
            <span className="text-white text-xs">1311 Games</span>
          </div>
        </div>
        <div className="flex gap-2.5 py-2 items-center">
          <span className="text-white text-xl font-semibold">750 Games won</span>
          <span className="text-success text-xs">57.2%</span>
        </div>
      </CardBody>
    </Card>
  );
};
